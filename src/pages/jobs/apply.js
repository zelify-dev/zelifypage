// Este archivo es necesario para que GitHub Pages pueda manejar la ruta /jobs/apply
// Redirige a la página de aplicación
if (typeof window !== 'undefined') {
    window.location.href = '/jobs/apply/index.html' + window.location.search;
} 