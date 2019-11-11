"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiRouter(app) {
    app.get("/api/user", function (req, res) {
        res.json({ a: 1, b: 2 });
    });
    return app;
}
exports.apiRouter = apiRouter;
