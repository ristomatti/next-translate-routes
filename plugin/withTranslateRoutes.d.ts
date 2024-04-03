import type { NextConfig } from 'next/dist/server/config-shared';
import { NextConfigWithNTR } from '../types';
/**
 * Inject translated routes
 */
export declare const withTranslateRoutes: (userNextConfig: NextConfigWithNTR) => NextConfig;
