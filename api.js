"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
function apiRouter(app) {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.get("/api/user", function (req, res) {
        res.json({ a: 1, b: 2 });
    });
    app.get("/base/get", function (req, res) {
        res.json({ a: 1, b: 2 });
    });
    app.post("/base/post", function (req, res) {
        res.json(req.body);
    });
    app.post("/base/buffer", function (req, res) {
        var msg = [];
        req.on("data", function (chunk) {
            if (chunk)
                msg.push(chunk);
        });
        req.on("end", function () {
            var buf = Buffer.concat(msg);
            res.json(buf.toJSON());
        });
    });
    // return app;
}
exports.apiRouter = apiRouter;
