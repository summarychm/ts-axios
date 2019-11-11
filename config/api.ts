import { Router, Request, Response } from "express";

export function apiRouter(app: Router) {
	app.get("/api/user", function(req: Request, res: Response) {
		res.json({ a: 1, b: 2 });
	});

	return app;
}
