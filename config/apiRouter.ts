import { Router, Request, Response } from "express";
import atob from "atob";
import bodyParser from "body-parser";

//TODO 这里引入自己编写的d.ts文件总是出错,暂改为require方式
// import multipart from "connect-multiparty";
const multipart = require("connect-multiparty");

export function apiRouter(app: Router) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// 加入 XSRF测试所需的cookie键值对
	app.use(function (req: Request, res: Response, next: any) {
		res.cookie("XSRF-TOKEN-D", "9527");
		next();
	});

	let router = app;

	registerSimpleRouter();

	registerBaseRouter();

	registerErrorRouter();

	registerExtendRouter();

	registerInterceptorRouter();

	registerConfigRouter();

	registerCancelRouter();

	registerWithCredentials();
	registerXsrf();

	registerMoreRouter();
	registerAuthorization();

	function registerSimpleRouter() {
		router.get("/simple/get", function (req, res) {
			res.json({
				msg: `hello world`,
			});
		});
	}

	function registerBaseRouter() {
		router.get("/base/get", function (req, res) {
			res.json(req.query);
		});

		router.post("/base/post", function (req, res) {
			res.json(req.body);
		});

		router.post("/base/buffer", function (req, res) {
			let msg: any[] = [];
			req.on("data", (chunk) => {
				if (chunk) {
					msg.push(chunk);
				}
			});
			req.on("end", () => {
				let buf = Buffer.concat(msg);
				res.json(buf.toJSON());
			});
		});
	}

	function registerErrorRouter() {
		router.get("/error/get", function (req, res) {
			if (Math.random() > 0.5) {
				res.json({
					msg: `hello world`,
				});
			} else {
				res.status(500);
				res.end();
			}
		});

		router.get("/error/timeout", function (req, res) {
			setTimeout(() => {
				res.json({
					msg: `hello world`,
				});
			}, 3000);
		});
	}

	function registerExtendRouter() {
		router.get("/extend/get", function (req, res) {
			res.json({
				msg: "hello world",
			});
		});

		router.options("/extend/options", function (req, res) {
			res.end();
		});

		router.delete("/extend/delete", function (req, res) {
			res.end();
		});

		router.head("/extend/head", function (req, res) {
			res.end();
		});

		router.post("/extend/post", function (req, res) {
			res.json(req.body);
		});

		router.put("/extend/put", function (req, res) {
			res.json(req.body);
		});

		router.patch("/extend/patch", function (req, res) {
			res.json(req.body);
		});

		router.get("/extend/user", function (req, res) {
			res.json({
				code: 0,
				message: "ok",
				result: {
					name: "jack",
					age: 18,
				},
			});
		});
	}

	function registerInterceptorRouter() {
		router.get("/interceptor/get", function (req, res) {
			res.end("hello");
		});
	}

	function registerConfigRouter() {
		router.post("/config/post", function (req, res) {
			res.json(req.body);
		});
	}

	function registerCancelRouter() {
		router.get("/cancel/get", function (req, res) {
			setTimeout(() => {
				res.json("hello");
			}, 1000);
		});

		router.post("/cancel/post", function (req, res) {
			setTimeout(() => {
				res.json(req.body);
			}, 1000);
		});
	}
	function registerWithCredentials() {
		router.get("/more/get", function (req, res) {
			res.json({ cookie: req.headers.cookie });
		});
	}
	function registerXsrf() {
		router.get("/more/xsrf", function (req, res) {
			res.json({ cookie: req.headers.cookie });
		});
	}
	function registerMoreRouter() {
		app.use(multipart({ uploadDir: "upload-files" }));
		router.get("/more/get", function (req, res) {
			res.json(req.cookies);
		});

		router.post("/more/upload", function (req, res) {
			console.log(req.body);
			res.end("upload success!");
		});
	}
	function registerAuthorization() {
		router.post("/more/post", function (req: Request, res: Response) {
			const auth = req.headers.authorization || "";
			const [type, credentials] = auth.split(" ");
			const [username, password] = atob(credentials).split(":");
			if (type === "Basic" && username === "Jack" && password === "test") {
				res.json(req.body);
			} else {
				res.status(401);
				res.end("UnAuthorization");
			}
		});
	}
}
