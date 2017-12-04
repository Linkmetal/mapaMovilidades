# Instrucciones

1. Crear un proyecto npm
```
npm init -y
```
2. Instalar las dependencias
```
npm i babel-core babel-loader babel-preset-es2015 css-loader file-loader node-sass style-loader url-loader webpack webpack-dev-server -D
```
3. Añadir los scripts tanto de produccion como de desarrollo (respetivamente).
```
"prod": "webpack --config webpack.config.js",
"pack": "webpack-dev-server --config webpack.config.js"
```

4. Recuerda modificar las rutas de los archivos js y scss en caso necesario.
```js
    entry: [
        /* archivo de entrada js */
        './src/js/main.js',
        /* archivo de entrada scss */
        './src/scss/main.scss'
    ],
    output:{
        /* nombre que quieras */
        filename:'bundle.js',
        /* ruta que quieras */
        path:path.resolve(__dirname,'dist/js/'),
        publicPath:'/dist/js'
    },
```

5. El html contenedor del js estara en **dist**