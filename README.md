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

Este repositorio contiene el código fuente del sitio web de Zelify, construido con Astro y desplegado en GitHub Pages.

## Características

- Sitio web multilingüe (inglés y español)
- Página de trabajos con filtros
- Formulario de aplicación para puestos de trabajo
- Envío de correos electrónicos desde el cliente usando EmailJS

## Configuración del Formulario de Aplicación

El formulario de aplicación utiliza [EmailJS](https://www.emailjs.com/) para enviar correos electrónicos directamente desde el navegador sin necesidad de un servidor backend. Para configurarlo:

1. **Regístrate en EmailJS**:
   - Crea una cuenta en [EmailJS](https://www.emailjs.com/)
   - Verifica tu correo electrónico

2. **Configura un servicio de correo**:
   - En el dashboard de EmailJS, ve a "Email Services"
   - Haz clic en "Add New Service"
   - Selecciona tu proveedor de correo (Gmail, Outlook, etc.)
   - Sigue las instrucciones para conectar tu cuenta de correo

3. **Crea una plantilla de correo**:
   - Ve a "Email Templates"
   - Haz clic en "Create New Template"
   - Diseña tu plantilla de correo utilizando las variables disponibles:
     - `{{position}}`: Posición a la que aplica el candidato
     - `{{firstName}}`: Nombre del candidato
     - `{{lastName}}`: Apellido del candidato
     - `{{email}}`: Correo electrónico del candidato
     - `{{phone}}`: Teléfono del candidato
     - Otras variables para las respuestas del cuestionario

4. **Actualiza el código**:
   - Abre el archivo `src/pages/jobs/apply.astro`
   - Reemplaza `YOUR_PUBLIC_KEY` con tu clave pública de EmailJS
   - Reemplaza `YOUR_SERVICE_ID` con el ID de tu servicio de correo
   - Reemplaza `YOUR_TEMPLATE_ID` con el ID de tu plantilla de correo

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar la compilación
npm run preview
```

## Despliegue

El sitio se despliega automáticamente en GitHub Pages cuando se hace push a la rama `master` utilizando GitHub Actions.

## Estructura del Proyecto

- `src/pages/`: Páginas del sitio
- `src/components/`: Componentes reutilizables
- `src/layouts/`: Layouts para las páginas
- `public/`: Archivos estáticos (imágenes, fuentes, etc.)

## Licencia

[MIT](LICENSE)
