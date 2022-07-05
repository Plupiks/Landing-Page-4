import { backupMethod, isObject, isScrollBehaviorSupported, modifyPrototypes } from "./common.js";
import { elementScrollIntoView } from "./scrollIntoView.js";
function elementScrollIntoViewBoolean(alignToTop) {
    elementScrollIntoView(this, {
        block: (alignToTop !== null && alignToTop !== void 0 ? alignToTop : true) ? "start" : "end",
        inline: "nearest",
    });
}
export const elementScrollIntoViewPolyfill = (config) => {
    if (isScrollBehaviorSupported(config)) {
        return;
    }
    const originalFunc = backupMethod(window.HTMLElement.prototype, "scrollIntoView", elementScrollIntoViewBoolean);
    modifyPrototypes("scrollIntoView", function scrollIntoView() {
        const args = arguments;
        const options = args[0];
        if (args.length === 1 && isObject(options)) {
            elementScrollIntoView(this, options, config);
            return;
        }
        originalFunc.apply(this, args);
    });
};
//# sourceMappingURL=scrollIntoView.polyfill.js.map