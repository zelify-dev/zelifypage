/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			sans: ['Nata Sans', 'sans-serif'],
			nata: ['Nata Sans', 'sans-serif'],
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
