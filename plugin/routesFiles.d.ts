export declare const isRoutesFileName: (fileName: string, routesDataFileName?: string) => boolean | "" | undefined;
/**
 * Get pages dir, trying both .pages (next < 13) and .pagesDir (next >= 13) syntaxes
 */
export declare const getPagesDir: () => string;
export declare const getAllRoutesFiles: (directoryPath?: string, routesDataFileName?: string) => string[];
