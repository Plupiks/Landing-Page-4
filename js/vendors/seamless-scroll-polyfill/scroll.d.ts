import type { IScrollConfig } from "./scroll-step";
interface ScrollMethod<T extends Element | typeof window> {
    (target: T, scrollOptions?: ScrollToOptions, config?: IScrollConfig): void;
}
export declare const scroll: ScrollMethod<(Window & typeof globalThis) | Element>;
export declare const scrollTo: ScrollMethod<(Window & typeof globalThis) | Element>;
export declare const scrollBy: ScrollMethod<(Window & typeof globalThis) | Element>;
export declare const elementScroll: ScrollMethod<Element>;
export declare const elementScrollTo: ScrollMethod<Element>;
export declare const elementScrollBy: ScrollMethod<Element>;
export declare const windowScroll: ScrollMethod<Window & typeof globalThis>;
export declare const windowScrollTo: ScrollMethod<Window & typeof globalThis>;
export declare const windowScrollBy: ScrollMethod<Window & typeof globalThis>;
export {};
//# sourceMappingURL=scroll.d.ts.map