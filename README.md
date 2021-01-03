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
~/ $ shopify serve
```

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

### Developing locally

Note: There are some issues which needs to be fixed before developing locally is possible again.

Run:
```sh
~/ $ npm run localdev
```

Note: You need to ***run at least once shopify serve*** before you can develope locally.

## Troubleshooting authentication problems

1. Stop the shopify tunnel with shopify tunnel stop

```
shopify tunnel stop
```

2. Connect to the right dev store with the right account

```
shopify connect
```

3. Run the server again and choose 'Yes' when the cli asks to update the Application URL

```
shopify serve
```

## License

Shopify App Node License:
This respository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

This project was bootstrapped using the Shopify App Node Boilerplate to create an embedded Shopify app made with Node, [Next.js](https://nextjs.org/), [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth), [Polaris](https://github.com/Shopify/polaris-react), and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components).
