import type { IScrollConfig } from "./scroll-step";
export declare const elementScrollPolyfill: (config?: IScrollConfig | undefined) => void;
export declare const elementScrollToPolyfill: (config?: IScrollConfig | undefined) => void;
export declare const elementScrollByPolyfill: (config?: IScrollConfig | undefined) => void;
export declare const modifyWindow: <T extends "scroll" | "scrollBy" | "scrollTo">(prop: T, func: (Window & typeof globalThis)[T]) => void;
export declare const windowScrollPolyfill: (config?: IScrollConfig | undefined) => void;
export declare const windowScrollToPolyfill: (config?: IScrollConfig | undefined) => void;
export declare const windowScrollByPolyfill: (config?: IScrollConfig | undefined) => void;
//# sourceMappingURL=scroll.polyfill.d.ts.map