# Astro Starter Kit: Basics

```
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![basics](https://user-images.githubusercontent.com/4677417/186188965-73453154-fdec-4d6b-9c34-cb35c248ae5b.png)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Zelify Website

Sitio web corporativo de Zelify con funcionalidad de listado de trabajos y formulario de aplicación.

## 🚀 Estructura del Proyecto

```
/
├── public/
│   └── assets/
│       ├── img/
│       └── ...
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── api/
│   │   │   └── submit-application.ts
│   │   ├── jobs/
│   │   │   └── apply.astro
│   │   └── ...
│   └── ...
└── package.json
```

## 🧞 Comandos

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala dependencias                             |
| `npm run dev`             | Inicia servidor local en `localhost:3000`        |
| `npm run build`           | Construye el sitio para producción en `./dist/`  |
| `npm run preview`         | Vista previa de la build antes de desplegar      |

## 📧 Configuración de Correo Electrónico

Para que el formulario de aplicación funcione correctamente, necesitas configurar las variables de entorno para el envío de correos:

1. Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`
2. Configura las siguientes variables:

```
EMAIL_USER=tu_correo@dominio.com
EMAIL_PASSWORD=tu_contraseña
EMAIL_HOST=smtp.dreamhost.com
EMAIL_PORT=465
```

## 🚀 Despliegue con GitHub Actions

El proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Configuración de Secretos

Para que el despliegue funcione correctamente con el envío de correos, debes configurar los siguientes secretos en tu repositorio de GitHub:

1. Ve a tu repositorio en GitHub
2. Ve a Settings > Secrets and variables > Actions
3. Agrega los siguientes secretos:
   - `EMAIL_USER`: Tu dirección de correo
   - `EMAIL_PASSWORD`: Tu contraseña de correo
   - `EMAIL_HOST`: El host SMTP (por defecto: smtp.dreamhost.com)
   - `EMAIL_PORT`: El puerto SMTP (por defecto: 465)

### Workflow

El archivo `.github/workflows/deploy.yml` contiene la configuración necesaria para:

1. Construir el sitio con las variables de entorno
2. Desplegar automáticamente en GitHub Pages

No es necesario modificar este archivo a menos que necesites personalizar el proceso de despliegue.
