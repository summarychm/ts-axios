## 简介

## Todo List

- [] 使用 TS 开发一版 axios,现实其绝大多数功能.
  - [x] 在浏览器端使用 XMLHttpRequest 对象通讯
  - [x] 支持 Promise API
  - [x] 支持请求和响应的拦截器
  - [x] 支持请求数据和响应数据的转换
  - [x] 支持 axios.create 创建新的 axios 实例
  - [] 支持请求的取消
  - [] JSON 数据的自动转换
  - [] 客户端防止 XSRF 攻击
- [x] 使用 TS 配置 webpackConfig,
  - [x] 使用 tsc 先编译 webpack.config.ts,
  - [x] 再运行 webpack-dev-server
- [x] 使用 webpack-dev-server 的 beforeHook 实现 mock 功能,省去搭建 server 步骤
- [x] 使用 eslint+gitCommitHook 来进行 tsCheck

## package List

```sh
npm install -D typescript ts-node ts-loader
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy
npm install -D  cross-env npm-run-all husky body-parser
npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugins
npm install -D axios qs

```
