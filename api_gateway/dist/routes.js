"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const config_1 = require("./config");
const router = (0, express_1.Router)();
// router.get('/health', (req: Request, res: Response) => {
//     res.status(200).send('API Gateway is running');
// });
const handleProxyError = (serviceName) => {
    return (err, req, res) => {
        console.error(`Proxy error for ${serviceName}: ${err.message}`);
        res.status(502).send(`Cannot connect to ${serviceName}: ${err.message}`);
    };
};
const createProxy = (target) => {
    const options = {
        target,
        changeOrigin: true,
        logLevel: "debug",
        onError: handleProxyError(target),
        cookieDomainRewrite: "",
        preserveHeaderKeyCase: true,
        // ❌ Remove onProxyReq
    };
    return (0, http_proxy_middleware_1.createProxyMiddleware)(options);
};
router.use("/api/user", createProxy(config_1.SERVICES.user));
router.use("/api/ai-tutor", createProxy(config_1.SERVICES.aiTutor));
router.use("/api/games", createProxy(config_1.SERVICES.game));
router.use("/api/courses", createProxy(config_1.SERVICES.content));
router.use("/api/ai-chatbot", createProxy(config_1.SERVICES.chatbot));
router.use("/api/admin", createProxy(config_1.SERVICES.admin));
exports.default = router;
