import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        const parsedQuery = await schema.query.parseAsync(req.query);
        // Express 5 req.query has no setter, mutate existing object
        for (const key of Object.keys(req.query)) {
          delete (req.query as any)[key];
        }
        Object.assign(req.query, parsedQuery);
      }
      if (schema.params) {
        const parsedParams = await schema.params.parseAsync(req.params);
        Object.assign(req.params, parsedParams);
      }
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          issues: error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message
          }))
        });
        return;
      }
      console.error('[Validation Error]:', error?.message || error);
      res.status(400).json({ error: error?.message || 'Invalid request payload' });
    }
  };
}
