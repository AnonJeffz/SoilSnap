import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5, 
    message: {
        error: "Too many login attempts from this IP, please try again after 60 seconds."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        return req.ip; 
    },

    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many login attempts from this IP, please try again after 15 minutes.",
            retryAfter: Math.round(req.rateLimit.resetTime - Date.now() / 1000)
        });
    }
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
    message: {
        error: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3, 
    message: {
        error: "Too many password reset attempts from this IP, please try again after 1 hour."
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip;
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many password reset attempts from this IP, please try again after 1 hour.",
            retryAfter: Math.round(req.rateLimit.resetTime - Date.now() / 1000)
        });
    }
});
