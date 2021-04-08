# Pandviewer

## Install dependencies

```sh
yarn
```
## Add typescript 
```sh
yarn add typescript --dev
```

## Run

```sh
yarn dev
```

Go to http://localhost:4042 in your web browser.

Solutions to the assets error:

1. Go to 'src' folder, add a folder 'types'.
2. Go to the 'types' folder, create a new file 'images.d.ts'.
3. Add a line to the file: `declare module '*.png';`
4. Then run `yarn dev` again.

## Deploy
```sh
yarn run build
```
