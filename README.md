# LADEVI Ventas (Front)

## About the app structure

Inside the `src/screens` directory we can find all the app routes with its internal components. Every route has a `Container` component where we made the link between react & redux, we then pass down the actions and portions of the redux store as props for the rest of the route to use.

Inside the `src/shared` directory we can find all the components,assets, services, redux stuff that are shared between all the app components

## Commands

To run the application in development mode

```
npm install
npm start
```

To run the production build.

```
npm install
npm run build
```

Build files should be located at the `build` directory

To run tests and push new image to docker hub, remind that it requires to be logged in to greencode organization

```
./run-tests.sh
```
