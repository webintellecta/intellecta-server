import { Router, Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { SERVICES } from "./config";
import { IncomingMessage, ServerResponse } from "http";

const router = Router();

// router.get('/health', (req: Request, res: Response) => {
//     res.status(200).send('API Gateway is running');
// });

const handleProxyError = (serviceName: string) => {
  return (err: Error, req: Request, res: Response) => {
    console.error(`Proxy error for ${serviceName}: ${err.message}`);
    res.status(502).send(`Cannot connect to ${serviceName}: ${err.message}`);
  };
};

const createProxy = (target: string) => {
  const options = {
    target,
    changeOrigin: true,
    logLevel: "debug",
    onError: handleProxyError(target),
    cookieDomainRewrite: "",
    preserveHeaderKeyCase: true,
    // ❌ Remove onProxyReq
  } as Options<IncomingMessage, ServerResponse<IncomingMessage>>;

  return createProxyMiddleware(options);
};

router.use("/api/user", createProxy(SERVICES.user));

router.use("/api/ai-tutor", createProxy(SERVICES.aiTutor));

router.use("/api/games", createProxy(SERVICES.game));

router.use("/api/courses", createProxy(SERVICES.content));

router.use("/api/ai-chatbot", createProxy(SERVICES.chatbot));

router.use("/api/admin", createProxy(SERVICES.admin));

export default router;