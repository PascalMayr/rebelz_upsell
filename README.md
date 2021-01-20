# Salestorm Upsell

## Getting started

1. Ask to be added to the repository on Github and to the shopify partner account.
2. Setup a development store for yourself in the shopify partners account.
3. Clone the repository.
4. Run:

```sh
~/ $ npm install
```

5. Install the [Shopify-App-CLI](https://github.com/Shopify/shopify-app-cli).
6. Install PostgreSQL
7. Enable the `citext` PostgreSQL extension:
```
psql
\c template1
CREATE EXTENSION citext;
```
8. Run `createdb salestorm && createdb salestorm_shadow` to create your development databases
9. Ask a developer for the `.env` file where your store and various API keys are stored.
10. Run:

```sh
~/ $ shopify connect
```
11. Select your account and your dev store.
12. Run:

```sh
~/ $ shopify serve --host https://loop.salestorm.cc:8081
```

13. Open the app URL shown in the output. The first time you do this Chrome will complain about an invalid certificate, [to circumvent this type "thisisunsafe" and Chrome will remember to trust the local certificate](https://medium.com/@dblazeski/chrome-bypass-net-err-cert-invalid-for-development-daefae43eb12).
14. Install and enable the ["Disable Content-Security-Policy" Chrome Extension](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden).

## Development guides

### Developing with the DB

1. Write your test SQL statement into the file 'current.sql'

2. To test the SQL statement run:
```sh
~/ $ npm run graphile watch
```

3. When finished testing your SQL statement you need to create a migration file with this command:
```sh
~/ $ npm run graphile commit
```

4. Run the migrations and test on shopify with:
```sh
~/ $ shopify serve
```

### Add new Animations
1.) Clone the animate.css repo
```sh
~/ $ git clone git@github.com:animate-css/animate.css.git
```

1.)
```sh
~/ $ cd animate.css/source
```

2.) Modify the @imports in the /source/animate.css file according to your needs;

3.)
```sh
~/ $ cd .. && yarn start
```

4.) Copy the content without comments of animate.min.css into the campaign_preview components style tag.

## Troubleshooting authentication problems

1. Connect to the right dev store with the right account

```
shopify connect
```

2. Run the server again and choose 'Yes' when the cli asks to update the Application URL

```
shopify serve
```

3. Check the status of the shopify system:
[shopifystatus.com](https://shopifystatus.com)
[status.shopify.com](https://status.shopify.com)
