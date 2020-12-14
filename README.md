# Salestorm Upsell

This project was bootstrapped using the Shopify App Node Boilerplate to create an embedded Shopify app made with Node, [Next.js](https://nextjs.org/), [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth), [Polaris](https://github.com/Shopify/polaris-react), and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components).

## Getting started

1. Clone the repository.
2. Run:

```sh
~/ $ npm install
```

3. Install the [Shopify-App-CLI](https://github.com/Shopify/shopify-app-cli).
4. Run:

```sh
~/ $ shopify serve
```

## Developing the Frontend locally

Run:
```sh
~/ $ npm run localdev
```

to develope the Frontend locally.

## Requirements

- Ask to be added to the shopify partner account.
- Setup a development store in the partner account if there isn't one already.

## License

Shopify App Node License:
This respository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Troubleshooting authentication problems

1. Stop the shopify tunnel with shopify tunnel stop

```
shopify tunnel stop
```

2. Run the server again and choose 'Yes' when the cli asks to update the Application URL

```
shopify serve
```
