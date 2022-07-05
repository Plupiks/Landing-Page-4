import { backupMethod, checkBehavior, elementScrollXY, failedExecute, failedExecuteInvalidEnumValue, isObject, scrollingElement, } from "./common.js";
import { now, step } from "./scroll-step.js";
// https://drafts.csswg.org/cssom-view/#normalize-non-finite-values
const nonFinite = (value) => {
    if (!isFinite(value)) {
        return 0;
    }
    return Number(value);
};
const isConnected = (node) => {
    var _a;
    return ((_a = node.isConnected) !== null && _a !== void 0 ? _a : (!node.ownerDocument ||
        // eslint-disable-next-line no-bitwise
        !(node.ownerDocument.compareDocumentPosition(node) & /** DOCUMENT_POSITION_DISCONNECTED */ 1)));
};
const scrollWithOptions = (element, options, config) => {
    var _a, _b;
    if (!isConnected(element)) {
        return;
    }
    const startX = element.scrollLeft;
    const startY = element.scrollTop;
    const targetX = nonFinite((_a = options.left) !== null && _a !== void 0 ? _a : startX);
    const targetY = nonFinite((_b = options.top) !== null && _b !== void 0 ? _b : startY);
    if (targetX === startX && targetY === startY) {
        return;
    }
    const fallback = backupMethod(HTMLElement.prototype, "scroll", elementScrollXY);
    const method = backupMethod(Object.getPrototypeOf(element), "scroll", fallback).bind(element);
    if (options.behavior !== "smooth") {
        method(targetX, targetY);
        return;
    }
    const removeEventListener = () => {
        window.removeEventListener("wheel", cancelScroll);
        window.removeEventListener("touchmove", cancelScroll);
    };
    const context = Object.assign(Object.assign({}, config), { timeStamp: now(), startX,
        startY,
        targetX,
        targetY, rafId: 0, method, callback: removeEventListener });
    const cancelScroll = () => {
        window.cancelAnimationFrame(context.rafId);
        removeEventListener();
    };
    window.addEventListener("wheel", cancelScroll, {
        passive: true,
        once: true,
    });
    window.addEventListener("touchmove", cancelScroll, {
        passive: true,
        once: true,
    });
    step(context);
};
const isWindow = (obj) => obj.window === obj;
const createScroll = (scrollName) => (target, scrollOptions, config) => {
    const [element, scrollType] = isWindow(target)
        ? [scrollingElement(target.document.documentElement), "Window"]
        : [target, "Element"];
    const options = scrollOptions !== null && scrollOptions !== void 0 ? scrollOptions : {};
    if (!isObject(options)) {
        throw new TypeError(failedExecute(scrollName, scrollType));
    }
    if (!checkBehavior(options.behavior)) {
        throw new TypeError(failedExecuteInvalidEnumValue(scrollName, scrollType, options.behavior));
    }
    if (scrollName === "scrollBy") {
        options.left = nonFinite(options.left) + element.scrollLeft;
        options.top = nonFinite(options.top) + element.scrollTop;
    }
    scrollWithOptions(element, options, config);
};
export const scroll = /* #__PURE__ */ createScroll("scroll");
export const scrollTo = /* #__PURE__ */ createScroll("scrollTo");
export const scrollBy = /* #__PURE__ */ createScroll("scrollBy");
export const elementScroll = scroll;
export const elementScrollTo = scrollTo;
export const elementScrollBy = scrollBy;
export const windowScroll = scroll;
export const windowScrollTo = scrollTo;
export const windowScrollBy = scrollBy;
//# sourceMappingURL=scroll.js.map