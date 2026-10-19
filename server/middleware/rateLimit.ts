import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export function rateLimiter(options: { maxRequests: number; windowMs: number; message?: string }) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup expired entries periodically
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetAt) {
        store.delete(key);
      }
    }
  }, 60000);
  if (timer.unref) timer.unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
               (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : null) ||
               req.socket?.remoteAddress ||
               '127.0.0.1';
    const now = Date.now();

    const record = store.get(ip);
    if (!record || now > record.resetAt) {
      store.set(ip, {
        count: 1,
        resetAt: now + options.windowMs
      });
      next();
      return;
    }

    if (record.count >= options.maxRequests) {
      res.status(429).json({
        error: options.message || 'Too many requests, please slow down.',
        retryAfterSec: Math.ceil((record.resetAt - now) / 1000)
      });
      return;
    }

    record.count++;
    next();
  };
}
