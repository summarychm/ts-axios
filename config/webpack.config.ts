import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

console.log("============ process.env begin ====================");
console.log(process.env);
console.log("============ process.env end ======================");
const config: webpack.Configuration = {
	// mode: "development",
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.[hash:8].js",
	},
	context: __dirname,
	devtool: "inline-source-map",
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		port: 3000,
		open: true,
		// proxy: {
		// 	// wds内置的express配合http-proxy-middleware
		// 	"/api": {
		// 		target: "http://localhost:3000",
		// 		pathRewrite: { "/api": "" }, // 重写最终发向服务器的 url
		// 		changeOrigin: true, // 改变主机的host,避免服务器验证不通过.
		// 	},
		// },
		before(app) {
			app.get("/api/user", function(req, res) {
				res.json({ a: 1, b: 2 });
			});
		},
	},
	externals: ["ts", "tsx", "js"],
	module: {
		rules: [
			{
				test: /.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true, // 不进行语法检查
							experimentalWatchApi: true,
							configFile: path.join(__dirname, "./config/tsconfig.json"),
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: "ts-axios",
			template: "./public/template.html",
		}),
	],
};
module.exports = config;
