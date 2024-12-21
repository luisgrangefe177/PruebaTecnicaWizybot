# React + Vite

Vamos a utilizar el Framework React + Vite para crear un proyecto

# Instalación

Para ejecutar este proyecto necesitamos instalar dependencias de noje obviamente teniendo instalado noje en nuestra computadora

# Comandos

Realizamos el comando para instalar dependencia:

```sh
npm install
```

Realizar la instalación de los iconos:

```sh
npm install lucide-react
```

Realizar la instalación de OpenAI:

```sh
npm install openai
```

Realizar la instalación de tailwindcss:

- Commando 1:

```sh
npm install -D tailwindcss postcss autoprefixer
```

- Commando 2:

```sh
npx tailwindcss init -p
```

Revisar que el archivo tailwind.config.js tenga las sigientes configuraciones:

```sh
/** @type {import('tailwindcss').Config} \*/
export default {
content: [
"./index.html",
"./src/**/\*.{js,ts,jsx,tsx}",
],
theme: {
extend: {},
},
plugins: [],
}
```

Muy importante crear el archivo .env en la raíz del proyecto y agregar la llave de OpenAI en la variable VITE_OPENAI_API_KEY

```sh
VITE_OPENAI_API_KEY="Aquí va la llave de OpenAI sin comillas"
```

Después de esto podemos ejecutar el proyecto con el comando:

```sh
npm run dev
```
