import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  id: string;
  isLocal: boolean;
  role: 'owner' | 'guest';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  // Zero-login local mode: automatically authenticate as local device owner
  if (!authHeader) {
    req.user = {
      id: 'local_device_owner',
      isLocal: true,
      role: 'owner'
    };
    next();
    return;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Unauthorized: Malformed token header' });
    return;
  }

  // Token authentication for sync sessions
  if (token.startsWith('flow_')) {
    req.user = {
      id: token,
      isLocal: false,
      role: 'owner'
    };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid session token' });
  }
}
