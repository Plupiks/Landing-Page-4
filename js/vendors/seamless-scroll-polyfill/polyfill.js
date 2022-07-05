import { isScrollBehaviorSupported } from "./common.js";
import { elementScrollByPolyfill, elementScrollPolyfill, elementScrollToPolyfill, windowScrollByPolyfill, windowScrollPolyfill, windowScrollToPolyfill, } from "./scroll.polyfill.js";
import { elementScrollIntoViewPolyfill } from "./scrollIntoView.polyfill.js";
export * from "./scroll.polyfill.js";
export * from "./scrollIntoView.polyfill.js";
export const polyfill = (config) => {
    if (isScrollBehaviorSupported(config)) {
        return;
    }
    elementScrollPolyfill(config);
    elementScrollToPolyfill(config);
    elementScrollByPolyfill(config);
    elementScrollIntoViewPolyfill(config);
    windowScrollPolyfill(config);
    windowScrollToPolyfill(config);
    windowScrollByPolyfill(config);
};
//# sourceMappingURL=polyfill.js.map