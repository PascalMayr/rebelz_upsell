import axios from "axios"
import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;
const setupShopifyAPI = async (ctx, next) => {
  ctx.shopifyAPI = axios.create({
    baseURL: `https://${ctx.session.shop}/admin/api/2020-10/`,
    headers: {
      'X-Shopify-Access-Token': ctx.session.accessToken,
      'Content-Type': 'application/json',
    },
    timeout: 30000
  })
  await next();
}

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.redirect("/");
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  server.use(bodyParser());
  router.get('(.*)', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  router.post('/api/publish-campaign', verifyRequest(), setupShopifyAPI, async (ctx) => {
    const themeResponse = await ctx.shopifyAPI.get('themes.json');
    const activeThemeID = themeResponse.data.themes.find(theme => theme.role === 'main').id;

    await ctx.shopifyAPI.put(`themes/${activeThemeID}/assets.json`, {
      asset: {
        key: 'snippets/salestorm.liquid',
        value: ctx.request.body.html
      }
    })

    const themeTemplateResponse = await ctx.shopifyAPI.get(`themes/${activeThemeID}/assets.json`, {
      params: {
        'asset[key]': 'layout/theme.liquid'
      }
    })
    const themeCode = themeTemplateResponse.data.asset.value;
    const renderSnippet = "\n{% capture salestorm_content %}{% render 'salestorm' %}{% endcapture %}\n{% unless salestorm_content contains 'Liquid error' %}\n{{ salestorm_content }}\n{% endunless %}\n";
    if(!themeCode.includes(renderSnippet)) {
      const sectionHeader = "{% section 'header' %}"
      const newThemeCode = themeCode.replace(sectionHeader, `${sectionHeader}${renderSnippet}`);
      await ctx.shopifyAPI.put(`themes/${activeThemeID}/assets.json`, {
        asset: {
          key: 'layout/theme.liquid',
          value: newThemeCode
        }
      })
    }

    ctx.status = 200
  });

  router.del('/api/unpublish-campaign', verifyRequest(), setupShopifyAPI, async (ctx) => {
    const themeResponse = await ctx.shopifyAPI.get('themes.json');
    const activeThemeID = themeResponse.data.themes.find(theme => theme.role === 'main').id;

    await ctx.shopifyAPI.put(`themes/${activeThemeID}/assets.json`, {
      asset: {
        key: 'snippets/salestorm.liquid',
        value: ''
      }
    })
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
