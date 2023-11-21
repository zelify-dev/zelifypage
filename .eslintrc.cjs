module.exports = {
	extends: ['plugin:astro/recommended', 'prettier'],
	overrides: [
		{
			files: ['src/**/*.astro', 'src/**/*.ts'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
			rules: {},
		},
	],
};
