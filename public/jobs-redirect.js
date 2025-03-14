// Este archivo es necesario para que GitHub Pages pueda manejar las rutas dinámicas
// Extrae el ID del trabajo de la URL
if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const jobId = path.split('/').pop();

    // Redirige a la página específica del trabajo
    if (jobId) {
        window.location.href = `/jobs/${jobId}/index.html`;
    }
} 