// eslint.config.js
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config({
	files: ['src/**/*.{js,jsx,ts,tsx}'],
	ignores: ['dist', 'node_modules', 'public'],
	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			ecmaFeatures: {
				jsx: true,
			},
			// project: './tsconfig.json',
		},
		ecmaVersion: 2020,
		globals: globals.browser,
	},
	plugins: {
		'@typescript-eslint': tseslint.plugin,
		react,
		'react-hooks': reactHooks,
		prettier,
		storybook,
		'unused-imports': unusedImports,
	},
	rules: {
		...tseslint.configs.recommended[0].rules,
		...react.configs.recommended.rules,
		...reactHooks.configs.recommended.rules,
		...storybook.configs.recommended.rules,

		'react/self-closing-comp': ['error', { component: true, html: true }],
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
		'react/function-component-definition': [
			'error',
			{
				namedComponents: 'arrow-function',
				unnamedComponents: 'arrow-function',
			},
		],
		'@typescript-eslint/no-use-before-define': ['error'],
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{ prefer: 'type-imports' },
		],
		'react/react-in-jsx-scope': 'off',
		'react/require-default-props': 'off',
		'react/jsx-props-no-spreading': 'off',
		'import/prefer-default-export': 'off',
		'import/extensions': 'off',
		'no-use-before-define': 'off',
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'no-param-reassign': [
			'error',
			{
				props: true,
				ignorePropertyModificationsFor: ['state'],
			},
		],
		'react/display-name': 'off',
		'no-plusplus': 'off',
		'react/button-has-type': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			typescript: {},
		},
	},
});
