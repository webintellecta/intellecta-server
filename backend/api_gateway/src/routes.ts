import { Router, Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { SERVICES } from "./config";

const router = Router();

// Health Check Route
router.get('/health', (req: Request, res: Response) => {
    res.status(200).send('API Gateway is running');
});

// Function to handle proxy errors
const handleProxyError = (serviceName: string) => {
    return (err: Error, req: Request, res: Response) => {
        console.error(`Proxy error for ${serviceName}: ${err.message}`);
        res.status(502).send(`Cannot connect to ${serviceName}: ${err.message}`);
    };
};

// Function to create proxy with explicit type casting
const createProxy = (target: string, pathRewrite: Record<string, string>) => 
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite,
        onError: handleProxyError(target),
        logLevel: 'debug' as any  // Cast to 'any' to bypass TypeScript error
    } as any); // Explicitly cast the whole object

// Proxy requests to User Service
router.use("/api/user", createProxy(SERVICES.user, { "^/api/user": "" }));

// Proxy requests to AI Tutor Service
router.use("/api/ai-tutor", createProxy(SERVICES.aiTutor, { "^/api/ai-tutor": "" }));

// Proxy requests to Game Service
router.use("/api/games", createProxy(SERVICES.game, { "^/api/games": "" }));

// Proxy requests to Content Service
router.use("/api/courses", createProxy(SERVICES.content, { "^/api/courses": "" }));

export default router;
