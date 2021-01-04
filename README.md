## 简介

使用 TypeScript 实现一版 axios

## Todo List

- [x] 已支持的主要功能.
  - [x] 在浏览器端使用 XMLHttpRequest 对象通讯
  - [x] 支持 Promise 链式调用
  - [x] 支持请求和响应的拦截器
  - [x] 支持默认配置和用户自定义配置
  - [x] 支持请求数据和响应数据的转换
  - [x] 支持 axios.create 创建新的 axios 实例
  - [x] JSON 数据的自动转换
  - [x] 支持请求的取消(基于 promise 分离 code)
  - [x] 跨域携带 cookie xhr.withCredentials
  - [x] XSRF: header 自动添加 token 键值对
  - [x] 支持上传/下载进度回调
  - [x] 支持 baseURL
  - [x] 支持 paramsSerializer
  - [x] 支持 axios.all / axios.spread / axios.Axios / getUri
- [x] 使用 TS 配置 webpackConfig,
  - [x] 使用 tsc 先编译 webpack.config.ts,
  - [x] 再运行 webpack-dev-server
- [x] 使用 webpack-dev-server 的 beforeHook 实现 mock 功能,省去搭建 server 步骤
- [x] 使用 eslint+gitCommitHook 来进行 tsCheck
- [ ] 进行单元测试
- [ ] 发布到 npm

## package List

```sh
npm install -D typescript ts-node ts-loader
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy
npm install -D  cross-env npm-run-all husky body-parser
npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugins
npm install -D axios qs nprogress atob connect-multiparty

```
