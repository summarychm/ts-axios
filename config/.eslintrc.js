module.exports = {
    "env": {
        "browser": true,
        commonjs: true,
        "es6": true
    },
    "extends": [
        // alloy规则
        'alloy',
        'alloy/typescript',
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-param-reassign": 0,
        "@typescript-eslint/no-empty-interface": 0
    }
};