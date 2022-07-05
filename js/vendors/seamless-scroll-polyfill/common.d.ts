import type { IScrollConfig } from "./scroll-step";
export declare const checkBehavior: (behavior?: string | undefined) => behavior is ScrollBehavior | undefined;
export declare function elementScrollXY(this: Element, x: number, y: number): void;
export declare const failedExecute: (method: string, object: string, reason?: string) => string;
export declare const failedExecuteInvalidEnumValue: (method: string, object: string, value: string) => string;
interface BackupMethod {
    <K extends keyof Element>(proto: Element, method: K): Element[K] | undefined;
    <K extends keyof Element>(proto: Element, method: K, fallback: unknown): Element[K];
    <K extends keyof Window>(proto: Window, method: K): Window[K] | undefined;
    <K extends keyof Window>(proto: Window, method: K, fallback: unknown): Window[K];
}
export declare const backupMethod: BackupMethod;
export declare const isObject: (value: unknown) => boolean;
export declare const isScrollBehaviorSupported: (config?: IScrollConfig | undefined) => boolean;
export declare const markPolyfill: (method: () => void) => void;
declare type Prototype = typeof HTMLElement.prototype | typeof SVGElement.prototype | typeof Element.prototype;
export declare const modifyPrototypes: <T extends "scroll" | "scrollBy" | "scrollIntoView" | "scrollTo">(prop: T, func: Prototype[T]) => void;
/**
 * - On Chrome and Firefox, document.scrollingElement will return the <html> element.
 * - Safari, document.scrollingElement will return the <body> element.
 * - On Edge, document.scrollingElement will return the <body> element.
 * - IE11 does not support document.scrollingElement, but you can assume its <html>.
 */
export declare const scrollingElement: (element: Element) => Element;
export {};
//# sourceMappingURL=common.d.ts.map