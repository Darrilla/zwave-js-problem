require("@oliveriq-com/eslint-config/patch");

module.exports = {
    root: true,
    extends: ['@oliveriq-com/eslint-config/typescript'],
    parserOptions: { project: './tsconfig.json' },
    ignorePatterns: ['.eslintrc.js', 'scripts/**/*.mjs', 'dist/**/*.js'],
};
