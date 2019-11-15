"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
function apiRouter(app) {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    var router = app;
    registerSimpleRouter();
    registerBaseRouter();
    registerErrorRouter();
    registerExtendRouter();
    registerInterceptorRouter();
    registerConfigRouter();
    registerCancelRouter();
    registerWithCredentials();
    function registerSimpleRouter() {
        router.get("/simple/get", function (req, res) {
            res.json({
                msg: "hello world",
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
            var msg = [];
            req.on("data", function (chunk) {
                if (chunk) {
                    msg.push(chunk);
                }
            });
            req.on("end", function () {
                var buf = Buffer.concat(msg);
                res.json(buf.toJSON());
            });
        });
    }
    function registerErrorRouter() {
        router.get("/error/get", function (req, res) {
            if (Math.random() > 0.5) {
                res.json({
                    msg: "hello world",
                });
            }
            else {
                res.status(500);
                res.end();
            }
        });
        router.get("/error/timeout", function (req, res) {
            setTimeout(function () {
                res.json({
                    msg: "hello world",
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
            setTimeout(function () {
                res.json("hello");
            }, 1000);
        });
        router.post("/cancel/post", function (req, res) {
            setTimeout(function () {
                res.json(req.body);
            }, 1000);
        });
    }
    function registerWithCredentials() {
        router.get("/more/get", function (req, res) {
            res.json({ cookie: req.headers.cookie });
        });
    }
}
exports.apiRouter = apiRouter;
