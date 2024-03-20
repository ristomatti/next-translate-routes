import type { TReRoutes, TRouteBranch, TRouteSegment } from '../types';
/**
 * Get redirects and rewrites for a page
 */
export declare const getPageReRoutes: <L extends string>(routeSegments: TRouteSegment<L>[]) => TReRoutes;
/**
 * Generate reroutes in route branch to feed the rewrite section of next.config
 */
export declare const getRouteBranchReRoutes: <L extends string = string>({ routeBranch: { children, ...routeSegment }, previousRouteSegments, }?: {
    routeBranch?: TRouteBranch<L> | undefined;
    previousRouteSegments?: TRouteSegment<L>[] | undefined;
}) => TReRoutes;
