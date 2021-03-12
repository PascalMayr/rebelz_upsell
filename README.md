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
9. Ask a developer for a copy of the `.env` file where various API keys and settings are stored.
10. Run:

```sh
~/ $ shopify connect
```

11. Select your account and your dev store.
12. Run:

```sh
~/ $ npm run serve
```

13. Open the app URL shown in the output. The first time you do this Chrome will complain about an invalid certificate, [to circumvent this type "thisisunsafe" and Chrome will remember to trust the local certificate](https://medium.com/@dblazeski/chrome-bypass-net-err-cert-invalid-for-development-daefae43eb12).
14. Install and enable the ["Disable Content-Security-Policy" Chrome Extension](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden).

***Note:***
In Firefox you can go to about:config and disable "security.csp.enable".

***Note:***
If you get any problem loading the startup script or the app in the admin panel try to refresh the page, turn off/on the chrome extension or try to access https://loop.salestorm.cc and type again "thisisunsafe".

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
~/ $ npm run serve
```

### Add new Animations

1.) Clone the animate.css repo

```sh
~/ $ git clone git@github.com:animate-css/animate.css.git
```

2.)
```sh
~/ $ cd animate.css/source
```

3.) Modify the @imports in the /source/animate.css file according to your needs;

4.)
```sh
~/ $ cd .. && yarn start
```

4.) Copy the content without comments of animate.min.css into the get_styles js file.

## Troubleshooting authentication/authorization problems

1. Connect to the right dev store with the right account

```
shopify connect
```

2. Run the server again and choose 'Yes' when the cli asks to update the Application URL

```
npm run serve
```

3. Check the status of the shopify system:
[shopifystatus.com](https://shopifystatus.com)
[status.shopify.com](https://status.shopify.com)

4. Make sure you are currently logged in into the store backend. For development stores, you have to login via the Partner dashboard.

5. If any API endpoint gives you a 403, check if you set the right SCOPES ENV and are allowed to access that resource.

## Support guides

### My campaign does not appear

We currently have to check the database manually to figure out why. If it should be shown according to the database, trigger the popup in the storefront and check the Javascript console.

Also possible is that the users internet is too slow and our popup isn't ready to be displayed yet, as not all data is received yet.

### The popup is not showing prices with the right currency

It could be that the current displayed currency in the merchants storefront is not used in the popup.
In such a case you need to investigate how to get the current three digit currency code applied by other JS in the merchant store.
The solution could be to find a global defined 'currency' variabe where the current Currency code is stored or to check the localStorage of the storefront.
As soon as you've found where the current displayed currency code is stored you need to assign it to our global variable like this:

```
window.Salestorm.currentCurrencyCode = localStorage.getItem('currentDisplayedCurrencyCode')
```

### Server Errors

graphQLErrors.forEach is not a function : The offline accessToken of the store is missing therefore no graphql client could be created.