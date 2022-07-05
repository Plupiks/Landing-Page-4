export const checkBehavior = (behavior) => {
    return behavior === undefined || behavior === "auto" || behavior === "instant" || behavior === "smooth";
};
export function elementScrollXY(x, y) {
    this.scrollLeft = x;
    this.scrollTop = y;
}
export const failedExecute = (method, object, reason = "cannot convert to dictionary.") => `Failed to execute '${method}' on '${object}': ${reason}`;
export const failedExecuteInvalidEnumValue = (method, object, value) => failedExecute(method, object, `The provided value '${value}' is not a valid enum value of type ScrollBehavior.`);
/* eslint-disable */
export const backupMethod = (proto, method, fallback) => {
    var _a;
    const backup = `__SEAMLESS.BACKUP$${method}`;
    if (!proto[backup] && proto[method] && !((_a = proto[method]) === null || _a === void 0 ? void 0 : _a.__isPolyfill)) {
        proto[backup] = proto[method];
    }
    return proto[backup] || fallback;
};
/* eslint-enable */
export const isObject = (value) => {
    const type = typeof value;
    return value !== null && (type === "object" || type === "function");
};
export const isScrollBehaviorSupported = (config) => "scrollBehavior" in window.document.documentElement.style && (config === null || config === void 0 ? void 0 : config.forcePolyfill) !== true;
export const markPolyfill = (method) => {
    Object.defineProperty(method, "__isPolyfill", { value: true });
};
export const modifyPrototypes = (prop, func) => {
    markPolyfill(func);
    [HTMLElement.prototype, SVGElement.prototype, Element.prototype].forEach((prototype) => {
        backupMethod(prototype, prop);
        prototype[prop] = func;
    });
};
/**
 * - On Chrome and Firefox, document.scrollingElement will return the <html> element.
 * - Safari, document.scrollingElement will return the <body> element.
 * - On Edge, document.scrollingElement will return the <body> element.
 * - IE11 does not support document.scrollingElement, but you can assume its <html>.
 */
export const scrollingElement = (element) => element.ownerDocument.scrollingElement || element.ownerDocument.documentElement;
//# sourceMappingURL=common.js.map