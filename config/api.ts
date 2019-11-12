import { Router, Request, Response } from "express";
import bodyParser from "body-parser";

export function apiRouter(app: Router) {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get("/api/user", function(req: Request, res: Response) {
		res.json({ a: 1, b: 2 });
	});
	app.get("/base/get", function(req: Request, res: Response) {
		res.json({ a: 1, b: 2 });
	});
	app.post("/base/post", function(req, res) {
		res.json(req.body);
	});

	app.post("/base/buffer", function(req, res) {
		let msg: any[] = [];
		req.on("data", (chunk) => {
			if (chunk) msg.push(chunk);
		});
		req.on("end", () => {
			let buf = Buffer.concat(msg);
			res.json(buf.toJSON());
		});
	});
	app.get("/error/get", function(req, res) {
		if (Math.random() > 0.5) {
			res.json({
				msg: `hello world`,
			});
		} else {
			res.status(500);
			res.end();
		}
	});

	app.get("/error/timeout", function(req, res) {
		setTimeout(() => {
			res.json({
				msg: `hello world`,
			});
		}, 3000);
	});
}
