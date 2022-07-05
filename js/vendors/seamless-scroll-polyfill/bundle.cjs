(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.seamless = {}));
})(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    var checkBehavior = function (behavior) {
        return behavior === undefined || behavior === "auto" || behavior === "instant" || behavior === "smooth";
    };
    function elementScrollXY(x, y) {
        this.scrollLeft = x;
        this.scrollTop = y;
    }
    var failedExecute = function (method, object, reason) {
        if (reason === void 0) { reason = "cannot convert to dictionary."; }
        return "Failed to execute '".concat(method, "' on '").concat(object, "': ").concat(reason);
    };
    var failedExecuteInvalidEnumValue = function (method, object, value) {
        return failedExecute(method, object, "The provided value '".concat(value, "' is not a valid enum value of type ScrollBehavior."));
    };
    /* eslint-disable */
    var backupMethod = function (proto, method, fallback) {
        var _a;
        var backup = "__SEAMLESS.BACKUP$".concat(method);
        if (!proto[backup] && proto[method] && !((_a = proto[method]) === null || _a === void 0 ? void 0 : _a.__isPolyfill)) {
            proto[backup] = proto[method];
        }
        return proto[backup] || fallback;
    };
    /* eslint-enable */
    var isObject = function (value) {
        var type = typeof value;
        return value !== null && (type === "object" || type === "function");
    };
    var isScrollBehaviorSupported = function (config) {
        return "scrollBehavior" in window.document.documentElement.style && (config === null || config === void 0 ? void 0 : config.forcePolyfill) !== true;
    };
    var markPolyfill = function (method) {
        Object.defineProperty(method, "__isPolyfill", { value: true });
    };
    var modifyPrototypes = function (prop, func) {
        markPolyfill(func);
        [HTMLElement.prototype, SVGElement.prototype, Element.prototype].forEach(function (prototype) {
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
    var scrollingElement = function (element) {
        return element.ownerDocument.scrollingElement || element.ownerDocument.documentElement;
    };

    var ease = function (k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    };
    /* eslint-disable */
    function now() {
        var _a;
        var fn;
        if ((_a = window.performance) === null || _a === void 0 ? void 0 : _a.now) {
            fn = function () { return window.performance.now(); };
        }
        else {
            fn = function () { return window.Date.now(); };
        }
        // @ts-ignore
        now = fn;
        return fn();
    }
    /* eslint-enable */
    var DURATION = 500;
    var step = function (context) {
        var currentTime = now();
        var elapsed = (currentTime - context.timeStamp) / (context.duration || DURATION);
        if (elapsed > 1) {
            context.method(context.targetX, context.targetY);
            context.callback();
            return;
        }
        var value = (context.timingFunc || ease)(elapsed);
        var currentX = context.startX + (context.targetX - context.startX) * value;
        var currentY = context.startY + (context.targetY - context.startY) * value;
        context.method(currentX, currentY);
        context.rafId = window.requestAnimationFrame(function () {
            step(context);
        });
    };

    // https://drafts.csswg.org/cssom-view/#normalize-non-finite-values
    var nonFinite = function (value) {
        if (!isFinite(value)) {
            return 0;
        }
        return Number(value);
    };
    var isConnected = function (node) {
        var _a;
        return ((_a = node.isConnected) !== null && _a !== void 0 ? _a : (!node.ownerDocument ||
            // eslint-disable-next-line no-bitwise
            !(node.ownerDocument.compareDocumentPosition(node) & /** DOCUMENT_POSITION_DISCONNECTED */ 1)));
    };
    var scrollWithOptions = function (element, options, config) {
        var _a, _b;
        if (!isConnected(element)) {
            return;
        }
        var startX = element.scrollLeft;
        var startY = element.scrollTop;
        var targetX = nonFinite((_a = options.left) !== null && _a !== void 0 ? _a : startX);
        var targetY = nonFinite((_b = options.top) !== null && _b !== void 0 ? _b : startY);
        if (targetX === startX && targetY === startY) {
            return;
        }
        var fallback = backupMethod(HTMLElement.prototype, "scroll", elementScrollXY);
        var method = backupMethod(Object.getPrototypeOf(element), "scroll", fallback).bind(element);
        if (options.behavior !== "smooth") {
            method(targetX, targetY);
            return;
        }
        var removeEventListener = function () {
            window.removeEventListener("wheel", cancelScroll);
            window.removeEventListener("touchmove", cancelScroll);
        };
        var context = __assign(__assign({}, config), { timeStamp: now(), startX: startX, startY: startY, targetX: targetX, targetY: targetY, rafId: 0, method: method, callback: removeEventListener });
        var cancelScroll = function () {
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
    var isWindow = function (obj) { return obj.window === obj; };
    var createScroll = function (scrollName) {
        return function (target, scrollOptions, config) {
            var _a = __read(isWindow(target)
                ? [scrollingElement(target.document.documentElement), "Window"]
                : [target, "Element"], 2), element = _a[0], scrollType = _a[1];
            var options = scrollOptions !== null && scrollOptions !== void 0 ? scrollOptions : {};
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
    };
    var scroll = /* #__PURE__ */ createScroll("scroll");
    var scrollTo = /* #__PURE__ */ createScroll("scrollTo");
    var scrollBy = /* #__PURE__ */ createScroll("scrollBy");
    var elementScroll = scroll;
    var elementScrollTo = scrollTo;
    var elementScrollBy = scrollBy;
    var windowScroll = scroll;
    var windowScrollTo = scrollTo;
    var windowScrollBy = scrollBy;

    // https://drafts.csswg.org/css-writing-modes-4/#block-flow
    var normalizeWritingMode = function (writingMode) {
        switch (writingMode) {
            case "horizontal-tb":
            case "lr":
            case "lr-tb":
            case "rl":
            case "rl-tb":
                return 0 /* HorizontalTb */;
            case "vertical-rl":
            case "tb":
            case "tb-rl":
                return 1 /* VerticalRl */;
            case "vertical-lr":
            case "tb-lr":
                return 2 /* VerticalLr */;
            case "sideways-rl":
                return 3 /* SidewaysRl */;
            case "sideways-lr":
                return 4 /* SidewaysLr */;
        }
        return 0 /* HorizontalTb */;
    };
    var calcPhysicalAxis = function (writingMode, isLTR, hPos, vPos) {
        var _a;
        /**  0b{vertical}{horizontal}  0: normal, 1: reverse */
        var layout = 0;
        /**
         * WritingMode.VerticalLr: ↓→
         * | 1 | 4 |   |
         * | 2 | 5 |   |
         * | 3 |   |   |
         *
         * RTL: ↑→
         * | 3 |   |   |
         * | 2 | 5 |   |
         * | 1 | 4 |   |
         */
        if (!isLTR) {
            layout ^= 2 /* ReverseVertical */;
        }
        switch (writingMode) {
            /**
             * ↓→
             * | 1 | 2 | 3 |
             * | 4 | 5 |   |
             * |   |   |   |
             *
             * RTL: ↓←
             * | 3 | 2 | 1 |
             * |   | 5 | 4 |
             * |   |   |   |
             */
            case 0 /* HorizontalTb */:
                // swap horizontal and vertical
                layout = (layout >> 1) | ((layout & 1) << 1);
                _a = __read([vPos, hPos], 2), hPos = _a[0], vPos = _a[1];
                break;
            /**
             * ↓←
             * |   | 4 | 1 |
             * |   | 5 | 2 |
             * |   |   | 3 |
             *
             * RTL: ↑←
             * |   |   | 3 |
             * |   | 5 | 2 |
             * |   | 4 | 1 |
             */
            case 1 /* VerticalRl */:
            case 3 /* SidewaysRl */:
                //  reverse horizontal
                layout ^= 1 /* ReverseHorizontal */;
                break;
            /**
             * ↑→
             * | 3 |   |   |
             * | 2 | 5 |   |
             * | 1 | 4 |   |
             *
             * RTL: ↓→
             * | 1 | 4 |   |
             * | 2 | 5 |   |
             * | 3 |   |   |
             */
            case 4 /* SidewaysLr */:
                // reverse vertical
                layout ^= 2 /* ReverseVertical */;
                break;
        }
        return [layout, hPos, vPos];
    };
    var isXReversed = function (computedStyle) {
        var layout = calcPhysicalAxis(normalizeWritingMode(computedStyle.writingMode), computedStyle.direction !== "rtl", undefined, undefined)[0];
        return (layout & 1) === 1;
    };
    // https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/dom/element.cc;l=1097-1189;drc=6a7533d4a1e9f2372223a9d912a9e53a6fa35ae0
    var toPhysicalAlignment = function (options, writingMode, isLTR) {
        var _a = __read(calcPhysicalAxis(writingMode, isLTR, options.block || "start", options.inline || "nearest"), 3), layout = _a[0], hPos = _a[1], vPos = _a[2];
        return [hPos, vPos].map(function (value, index) {
            switch (value) {
                case "center":
                    return 1 /* CenterAlways */;
                case "nearest":
                    return 0 /* ToEdgeIfNeeded */;
                default: {
                    var reverse = (layout >> index) & 1;
                    return (value === "start") === !reverse ? 2 /* LeftOrTop */ : 3 /* RightOrBottom */;
                }
            }
        });
    };
    // code from stipsan/compute-scroll-into-view
    // https://github.com/stipsan/compute-scroll-into-view/blob/5396c6b78af5d0bbce11a7c4e93cc3146546fcd3/src/index.ts
    /**
     * Find out which edge to align against when logical scroll position is "nearest"
     * Interesting fact: "nearest" works similarily to "if-needed", if the element is fully visible it will not scroll it
     *
     * Legends:
     * ┌────────┐ ┏ ━ ━ ━ ┓
     * │ target │   frame
     * └────────┘ ┗ ━ ━ ━ ┛
     */
    var mapNearest = function (align, scrollingEdgeStart, scrollingEdgeEnd, scrollingSize, elementEdgeStart, elementEdgeEnd, elementSize) {
        if (align !== 0 /* ToEdgeIfNeeded */) {
            return align;
        }
        /**
         * If element edge A and element edge B are both outside scrolling box edge A and scrolling box edge B
         *
         *          ┌──┐
         *        ┏━│━━│━┓
         *          │  │
         *        ┃ │  │ ┃        do nothing
         *          │  │
         *        ┗━│━━│━┛
         *          └──┘
         *
         *  If element edge C and element edge D are both outside scrolling box edge C and scrolling box edge D
         *
         *    ┏ ━ ━ ━ ━ ┓
         *   ┌───────────┐
         *   │┃         ┃│        do nothing
         *   └───────────┘
         *    ┗ ━ ━ ━ ━ ┛
         */
        if ((elementEdgeStart < scrollingEdgeStart && elementEdgeEnd > scrollingEdgeEnd) ||
            (elementEdgeStart > scrollingEdgeStart && elementEdgeEnd < scrollingEdgeEnd)) {
            return null;
        }
        /**
         * If element edge A is outside scrolling box edge A and element height is less than scrolling box height
         *
         *          ┌──┐
         *        ┏━│━━│━┓         ┏━┌━━┐━┓
         *          └──┘             │  │
         *  from  ┃      ┃     to  ┃ └──┘ ┃
         *
         *        ┗━ ━━ ━┛         ┗━ ━━ ━┛
         *
         * If element edge B is outside scrolling box edge B and element height is greater than scrolling box height
         *
         *        ┏━ ━━ ━┓         ┏━┌━━┐━┓
         *                           │  │
         *  from  ┃ ┌──┐ ┃     to  ┃ │  │ ┃
         *          │  │             │  │
         *        ┗━│━━│━┛         ┗━│━━│━┛
         *          │  │             └──┘
         *          │  │
         *          └──┘
         *
         * If element edge C is outside scrolling box edge C and element width is less than scrolling box width
         *
         *       from                 to
         *    ┏ ━ ━ ━ ━ ┓         ┏ ━ ━ ━ ━ ┓
         *  ┌───┐                 ┌───┐
         *  │ ┃ │       ┃         ┃   │     ┃
         *  └───┘                 └───┘
         *    ┗ ━ ━ ━ ━ ┛         ┗ ━ ━ ━ ━ ┛
         *
         * If element edge D is outside scrolling box edge D and element width is greater than scrolling box width
         *
         *       from                 to
         *    ┏ ━ ━ ━ ━ ┓         ┏ ━ ━ ━ ━ ┓
         *        ┌───────────┐   ┌───────────┐
         *    ┃   │     ┃     │   ┃         ┃ │
         *        └───────────┘   └───────────┘
         *    ┗ ━ ━ ━ ━ ┛         ┗ ━ ━ ━ ━ ┛
         */
        if ((elementEdgeStart <= scrollingEdgeStart && elementSize <= scrollingSize) ||
            (elementEdgeEnd >= scrollingEdgeEnd && elementSize >= scrollingSize)) {
            return 2 /* LeftOrTop */;
        }
        /**
         * If element edge B is outside scrolling box edge B and element height is less than scrolling box height
         *
         *        ┏━ ━━ ━┓         ┏━ ━━ ━┓
         *
         *  from  ┃      ┃     to  ┃ ┌──┐ ┃
         *          ┌──┐             │  │
         *        ┗━│━━│━┛         ┗━└━━┘━┛
         *          └──┘
         *
         * If element edge A is outside scrolling box edge A and element height is greater than scrolling box height
         *
         *          ┌──┐
         *          │  │
         *          │  │             ┌──┐
         *        ┏━│━━│━┓         ┏━│━━│━┓
         *          │  │             │  │
         *  from  ┃ └──┘ ┃     to  ┃ │  │ ┃
         *                           │  │
         *        ┗━ ━━ ━┛         ┗━└━━┘━┛
         *
         * If element edge C is outside scrolling box edge C and element width is greater than scrolling box width
         *
         *           from                 to
         *        ┏ ━ ━ ━ ━ ┓         ┏ ━ ━ ━ ━ ┓
         *  ┌───────────┐           ┌───────────┐
         *  │     ┃     │   ┃       │ ┃         ┃
         *  └───────────┘           └───────────┘
         *        ┗ ━ ━ ━ ━ ┛         ┗ ━ ━ ━ ━ ┛
         *
         * If element edge D is outside scrolling box edge D and element width is less than scrolling box width
         *
         *           from                 to
         *        ┏ ━ ━ ━ ━ ┓         ┏ ━ ━ ━ ━ ┓
         *                ┌───┐             ┌───┐
         *        ┃       │ ┃ │       ┃     │   ┃
         *                └───┘             └───┘
         *        ┗ ━ ━ ━ ━ ┛         ┗ ━ ━ ━ ━ ┛
         *
         */
        if ((elementEdgeEnd > scrollingEdgeEnd && elementSize < scrollingSize) ||
            (elementEdgeStart < scrollingEdgeStart && elementSize > scrollingSize)) {
            return 3 /* RightOrBottom */;
        }
        return null;
    };
    var canOverflow = function (overflow) {
        return overflow !== "visible" && overflow !== "clip";
    };
    var getFrameElement = function (element) {
        var _a;
        try {
            return ((_a = element.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.frameElement) || null;
        }
        catch (_b) {
            return null;
        }
    };
    var isScrollable = function (element, computedStyle) {
        if (element.clientHeight < element.scrollHeight || element.clientWidth < element.scrollWidth) {
            return (canOverflow(computedStyle.overflowY) ||
                canOverflow(computedStyle.overflowX) ||
                element === scrollingElement(element));
        }
        return false;
    };
    var parentElement = function (element) {
        var pNode = element.parentNode;
        var pElement = element.parentElement;
        if (pElement === null && pNode !== null) {
            if (pNode.nodeType === /** Node.DOCUMENT_FRAGMENT_NODE */ 11) {
                return pNode.host;
            }
            if (pNode.nodeType === /** Node.DOCUMENT_NODE */ 9) {
                return getFrameElement(element);
            }
        }
        return pElement;
    };
    var clamp = function (value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };
    var getSupportedScrollMarginProperty = function (ownerDocument) {
        // Webkit uses "scroll-snap-margin" https://bugs.webkit.org/show_bug.cgi?id=189265.
        return ["scroll-margin", "scroll-snap-margin"].filter(function (property) { return property in ownerDocument.documentElement.style; })[0];
    };
    var getElementScrollSnapArea = function (element, elementRect, computedStyle) {
        var top = elementRect.top, right = elementRect.right, bottom = elementRect.bottom, left = elementRect.left;
        var scrollProperty = getSupportedScrollMarginProperty(element.ownerDocument);
        if (!scrollProperty) {
            return [top, right, bottom, left];
        }
        var scrollMarginValue = function (edge) {
            var value = computedStyle.getPropertyValue("".concat(scrollProperty, "-").concat(edge));
            return parseInt(value, 10) || 0;
        };
        return [
            top - scrollMarginValue("top"),
            right + scrollMarginValue("right"),
            bottom + scrollMarginValue("bottom"),
            left - scrollMarginValue("left"),
        ];
    };
    var calcAlignEdge = function (align, start, end) {
        switch (align) {
            case 1 /* CenterAlways */:
                return (start + end) / 2;
            case 3 /* RightOrBottom */:
                return end;
            case 2 /* LeftOrTop */:
            case 0 /* ToEdgeIfNeeded */:
                return start;
        }
    };
    var getFrameViewport = function (frame, frameRect) {
        var _a, _b, _c;
        var visualViewport = (_a = frame.ownerDocument.defaultView) === null || _a === void 0 ? void 0 : _a.visualViewport;
        var _d = __read(frame === scrollingElement(frame)
            ? [0, 0, (_b = visualViewport === null || visualViewport === void 0 ? void 0 : visualViewport.width) !== null && _b !== void 0 ? _b : frame.clientWidth, (_c = visualViewport === null || visualViewport === void 0 ? void 0 : visualViewport.height) !== null && _c !== void 0 ? _c : frame.clientHeight]
            : [frameRect.left, frameRect.top, frame.clientWidth, frame.clientHeight], 4), x = _d[0], y = _d[1], width = _d[2], height = _d[3];
        var left = x + frame.clientLeft;
        var top = y + frame.clientTop;
        var right = left + width;
        var bottom = top + height;
        return [top, right, bottom, left];
    };
    var computeScrollIntoView = function (element, options) {
        // Collect all the scrolling boxes, as defined in the spec: https://drafts.csswg.org/cssom-view/#scrolling-box
        var actions = [];
        var ownerDocument = element.ownerDocument;
        var ownerWindow = ownerDocument.defaultView;
        if (!ownerWindow) {
            return actions;
        }
        var computedStyle = window.getComputedStyle(element);
        var isLTR = computedStyle.direction !== "rtl";
        var writingMode = normalizeWritingMode(computedStyle.writingMode ||
            computedStyle.getPropertyValue("-webkit-writing-mode") ||
            computedStyle.getPropertyValue("-ms-writing-mode"));
        var _a = __read(toPhysicalAlignment(options, writingMode, isLTR), 2), alignH = _a[0], alignV = _a[1];
        var _b = __read(getElementScrollSnapArea(element, element.getBoundingClientRect(), computedStyle), 4), top = _b[0], right = _b[1], bottom = _b[2], left = _b[3];
        for (var frame = parentElement(element); frame !== null; frame = parentElement(frame)) {
            if (ownerDocument !== frame.ownerDocument) {
                ownerDocument = frame.ownerDocument;
                ownerWindow = ownerDocument.defaultView;
                if (!ownerWindow) {
                    break;
                }
                var _c = frame.getBoundingClientRect(), dX = _c.left, dY = _c.top;
                top += dY;
                right += dX;
                bottom += dY;
                left += dX;
            }
            var frameStyle = ownerWindow.getComputedStyle(frame);
            if (frameStyle.position === "fixed") {
                break;
            }
            if (!isScrollable(frame, frameStyle)) {
                continue;
            }
            var frameRect = frame.getBoundingClientRect();
            var _d = __read(getFrameViewport(frame, frameRect), 4), frameTop = _d[0], frameRight = _d[1], frameBottom = _d[2], frameLeft = _d[3];
            var eAlignH = mapNearest(alignH, frameLeft, frameRight, frame.clientWidth, left, right, right - left);
            var eAlignV = mapNearest(alignV, frameTop, frameBottom, frame.clientHeight, top, bottom, bottom - top);
            var diffX = eAlignH === null ? 0 : calcAlignEdge(eAlignH, left, right) - calcAlignEdge(eAlignH, frameLeft, frameRight);
            var diffY = eAlignV === null ? 0 : calcAlignEdge(eAlignV, top, bottom) - calcAlignEdge(eAlignV, frameTop, frameBottom);
            var moveX = isXReversed(frameStyle)
                ? clamp(diffX, -frame.scrollWidth + frame.clientWidth - frame.scrollLeft, -frame.scrollLeft)
                : clamp(diffX, -frame.scrollLeft, frame.scrollWidth - frame.clientWidth - frame.scrollLeft);
            var moveY = clamp(diffY, -frame.scrollTop, frame.scrollHeight - frame.clientHeight - frame.scrollTop);
            actions.push([
                frame,
                { left: frame.scrollLeft + moveX, top: frame.scrollTop + moveY, behavior: options.behavior },
            ]);
            top = Math.max(top - moveY, frameTop);
            right = Math.min(right - moveX, frameRight);
            bottom = Math.min(bottom - moveY, frameBottom);
            left = Math.max(left - moveX, frameLeft);
        }
        return actions;
    };
    var scrollIntoView = function (element, scrollIntoViewOptions, config) {
        var options = scrollIntoViewOptions || {};
        if (!checkBehavior(options.behavior)) {
            throw new TypeError(failedExecuteInvalidEnumValue("scrollIntoView", "Element", options.behavior));
        }
        var actions = computeScrollIntoView(element, options);
        actions.forEach(function (_a) {
            var _b = __read(_a, 2), frame = _b[0], scrollToOptions = _b[1];
            elementScroll(frame, scrollToOptions, config);
        });
    };
    var elementScrollIntoView = scrollIntoView;

    var createPolyfill = function (scrollName, patch) {
        return function (config) {
            if (isScrollBehaviorSupported(config)) {
                return;
            }
            var scrollMethod = {
                scroll: scroll,
                scrollTo: scrollTo,
                scrollBy: scrollBy,
            }[scrollName];
            patch(scrollName, function () {
                var args = arguments;
                if (arguments.length === 1) {
                    scrollMethod(this, args[0], config);
                    return;
                }
                var left = args[0];
                var top = args[1];
                scrollMethod(this, { left: left, top: top });
            });
        };
    };
    var elementScrollPolyfill = /* #__PURE__ */ createPolyfill("scroll", modifyPrototypes);
    var elementScrollToPolyfill = /* #__PURE__ */ createPolyfill("scrollTo", modifyPrototypes);
    var elementScrollByPolyfill = /* #__PURE__ */ createPolyfill("scrollBy", modifyPrototypes);
    var modifyWindow = function (prop, func) {
        markPolyfill(func);
        backupMethod(window, prop);
        window[prop] = func;
    };
    var windowScrollPolyfill = /* #__PURE__ */ createPolyfill("scroll", modifyWindow);
    var windowScrollToPolyfill = /* #__PURE__ */ createPolyfill("scrollTo", modifyWindow);
    var windowScrollByPolyfill = /* #__PURE__ */ createPolyfill("scrollBy", modifyWindow);

    function elementScrollIntoViewBoolean(alignToTop) {
        elementScrollIntoView(this, {
            block: (alignToTop !== null && alignToTop !== void 0 ? alignToTop : true) ? "start" : "end",
            inline: "nearest",
        });
    }
    var elementScrollIntoViewPolyfill = function (config) {
        if (isScrollBehaviorSupported(config)) {
            return;
        }
        var originalFunc = backupMethod(window.HTMLElement.prototype, "scrollIntoView", elementScrollIntoViewBoolean);
        modifyPrototypes("scrollIntoView", function scrollIntoView() {
            var args = arguments;
            var options = args[0];
            if (args.length === 1 && isObject(options)) {
                elementScrollIntoView(this, options, config);
                return;
            }
            originalFunc.apply(this, args);
        });
    };

    var polyfill = function (config) {
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

    exports.elementScroll = elementScroll;
    exports.elementScrollBy = elementScrollBy;
    exports.elementScrollByPolyfill = elementScrollByPolyfill;
    exports.elementScrollIntoView = elementScrollIntoView;
    exports.elementScrollIntoViewPolyfill = elementScrollIntoViewPolyfill;
    exports.elementScrollPolyfill = elementScrollPolyfill;
    exports.elementScrollTo = elementScrollTo;
    exports.elementScrollToPolyfill = elementScrollToPolyfill;
    exports.modifyWindow = modifyWindow;
    exports.polyfill = polyfill;
    exports.scroll = scroll;
    exports.scrollBy = scrollBy;
    exports.scrollIntoView = scrollIntoView;
    exports.scrollTo = scrollTo;
    exports.windowScroll = windowScroll;
    exports.windowScrollBy = windowScrollBy;
    exports.windowScrollByPolyfill = windowScrollByPolyfill;
    exports.windowScrollPolyfill = windowScrollPolyfill;
    exports.windowScrollTo = windowScrollTo;
    exports.windowScrollToPolyfill = windowScrollToPolyfill;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=bundle.cjs.map
