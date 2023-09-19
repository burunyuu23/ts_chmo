# React + TypeScript + Vite


[скрины](#скрины)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

<a id="скрины"></a>

![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/5e5b306b-612f-4b4f-bd93-03177641a093)
![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/b383dcc9-d448-4e52-831e-7b0beddaec3d)
![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/7b6835b7-6b22-4ea1-ad1d-b9bcf492324d)
![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/bedb00b0-eb1c-434b-9670-04958d4af403)


