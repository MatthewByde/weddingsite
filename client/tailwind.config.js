/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'./node_modules/flowbite-react/lib/esm/**/*.js',
	],

	theme: {
		extend: {},
		colors: {
			backgroundColor: '#E9EDEA',
			secondaryColor: '#2e385c',
			darkAccentColor: '#217071',
			lightAccentColor: '#DBBEB9',
			textColor: '#141927',
		},
	},
	plugins: [require('flowbite/plugin')],
};
