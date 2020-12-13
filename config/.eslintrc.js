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
        "no-param-reassign": 0, // 形参再次赋值
        "max-params": 0, // 函数最大参数为3.在构造函数时很麻烦
        "guard-for-in": 0, // for in必须搭配,axios复合对象需要拷贝axios实例上的interceptor和原型工具方法
        "spaced-comment": 0, // "/*"后可以跟任意字符
        "@typescript-eslint/no-empty-interface": 0, // 当前接口和他父级一模一样
        "@typescript-eslint/explicit-member-accessibility": 0, // 属性必须带访问修饰符,默认认为是public
        "@typescript-eslint/prefer-function-type": 0,// 只有一个类型注解的interface也不用type转换
    }
};