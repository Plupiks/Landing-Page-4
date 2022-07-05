import { backupMethod, isScrollBehaviorSupported, markPolyfill, modifyPrototypes } from "./common.js";
import { scroll, scrollBy, scrollTo } from "./scroll.js";
const createPolyfill = (scrollName, patch) => (config) => {
    if (isScrollBehaviorSupported(config)) {
        return;
    }
    const scrollMethod = {
        scroll,
        scrollTo,
        scrollBy,
    }[scrollName];
    patch(scrollName, function () {
        const args = arguments;
        if (arguments.length === 1) {
            scrollMethod(this, args[0], config);
            return;
        }
        const left = args[0];
        const top = args[1];
        scrollMethod(this, { left, top });
    });
};
export const elementScrollPolyfill = /* #__PURE__ */ createPolyfill("scroll", modifyPrototypes);
export const elementScrollToPolyfill = /* #__PURE__ */ createPolyfill("scrollTo", modifyPrototypes);
export const elementScrollByPolyfill = /* #__PURE__ */ createPolyfill("scrollBy", modifyPrototypes);
export const modifyWindow = (prop, func) => {
    markPolyfill(func);
    backupMethod(window, prop);
    window[prop] = func;
};
export const windowScrollPolyfill = /* #__PURE__ */ createPolyfill("scroll", modifyWindow);
export const windowScrollToPolyfill = /* #__PURE__ */ createPolyfill("scrollTo", modifyWindow);
export const windowScrollByPolyfill = /* #__PURE__ */ createPolyfill("scrollBy", modifyWindow);
//# sourceMappingURL=scroll.polyfill.js.map