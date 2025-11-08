import { Request } from 'express';
import { DEFAULTS } from '../constants';
import { PaginationQuery } from '../types';

/**
 * Extract pagination parameters from request query
 */
export const getPaginationParams = (req: Request): { page: number; limit: number; skip: number } => {
  const page = parseInt((req.query as PaginationQuery).page || String(DEFAULTS.PAGINATION.PAGE));
  const limit = parseInt((req.query as PaginationQuery).limit || String(DEFAULTS.PAGINATION.LIMIT));
  const skip = (page - 1) * limit;

  return {
    page: page > 0 ? page : DEFAULTS.PAGINATION.PAGE,
    limit: limit > 0 ? limit : DEFAULTS.PAGINATION.LIMIT,
    skip: skip >= 0 ? skip : 0,
  };
};

