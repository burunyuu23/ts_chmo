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

![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/1874233e-a40e-4e13-99d4-9cdcf65629a4)
![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/a105cf76-fd51-48c8-bcf1-b47c1ccedffa)
![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/b37e4a5e-bb1d-4de6-b4cf-17014492415c)
![image](https://github.com/burunyuu23/ts_chmo/assets/34377854/b76058b3-b631-45a4-9821-2c1a7bedcba6)
