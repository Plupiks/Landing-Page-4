export interface IScrollConfig {
    readonly duration?: number;
    readonly forcePolyfill?: boolean;
    readonly timingFunc?: (k: number) => number;
}
export interface IContext extends IScrollConfig {
    readonly timeStamp: number;
    readonly startX: number;
    readonly startY: number;
    readonly targetX: number;
    readonly targetY: number;
    readonly method: (x: number, y: number) => void;
    readonly callback: () => void;
    rafId: number;
}
export declare function now(): number;
export declare const step: (context: IContext) => void;
//# sourceMappingURL=scroll-step.d.ts.map