// Type definitions for EaselJS 0.6.1 (partial, based on minified source)
declare namespace createjs {
  // Utility types
  interface Point {
    x: number;
    y: number;
  }

  interface Shadow {
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
    // ...
  }

  interface Filter {
    applyFilter(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
    // ...
  }

  // EventDispatcher
  interface EventDispatcher {
    addEventListener(type: string, listener: Function): void;
    removeEventListener(type: string, listener: Function): void;
    removeAllEventListeners(type?: string): void;
    dispatchEvent(event: any): void;
    hasEventListener(type: string): boolean;
    _listeners: any;
  }

  // Matrix2D
  class Matrix2D {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    alpha: number;
    identity(): Matrix2D;
    appendTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix2D;
    append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D;
    prependTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix2D;
    prependProperties(alpha: number, shadow: Shadow | null, compositeOperation: string | null): Matrix2D;
    invert(): Matrix2D;
    // ...
  }

  // UID
  namespace UID {
    function get(): number;
  }

  // DisplayObject
  class DisplayObject implements EventDispatcher {
    static suppressCrossDomainErrors: boolean;
    static _hitTestCanvas: HTMLCanvasElement;
    static _hitTestContext: CanvasRenderingContext2D;
    static _nextCacheID: number;

    alpha: number;
    cacheCanvas: HTMLCanvasElement | null;
    id: number;
    mouseEnabled: boolean;
    name: string | null;
    parent: Container | null;
    regX: number;
    regY: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    shadow: Shadow | null;
    visible: boolean;
    x: number;
    y: number;
    compositeOperation: string | null;
    snapToPixel: boolean;
    onPress: ((event: any) => void) | null;
    onClick: ((event: any) => void) | null;
    onDoubleClick: ((event: any) => void) | null;
    onMouseOver: ((event: any) => void) | null;
    onMouseOut: ((event: any) => void) | null;
    onTick: ((event: any) => void) | null;
    filters: Filter[] | null;
    cacheID: number;
    mask: DisplayObject | null;
    hitArea: DisplayObject | null;
    cursor: string | null;
    _listeners: any;
    _matrix: Matrix2D;

    constructor();
    initialize(): void;
    isVisible(): boolean;
    draw(ctx: CanvasRenderingContext2D, ignoreCache?: boolean): boolean;
    updateContext(ctx: CanvasRenderingContext2D): void;
    cache(x: number, y: number, width: number, height: number, scale?: number): void;
    updateCache(compositeOperation?: string): void;
    uncache(): void;
    getCacheDataURL(): string | null;
    getStage(): Stage | null;
    localToGlobal(x: number, y: number): Point | null;
    globalToLocal(x: number, y: number): Point | null;
    localToLocal(x: number, y: number, target: DisplayObject): Point | null;
    setTransform(x: number, y: number, scaleX?: number, scaleY?: number, rotation?: number, skewX?: number, skewY?: number, regX?: number, regY?: number): this;
    getMatrix(matrix?: Matrix2D): Matrix2D;
    getConcatenatedMatrix(matrix?: Matrix2D): Matrix2D;
    hitTest(x: number, y: number): boolean;
    set(props: Partial<DisplayObject>): this;
    clone(): DisplayObject;
    toString(): string;
    cloneProps(o: DisplayObject): void;
    // EventDispatcher methods
    addEventListener(type: string, listener: Function): void;
    removeEventListener(type: string, listener: Function): void;
    removeAllEventListeners(type?: string): void;
    dispatchEvent(event: any): void;
    hasEventListener(type: string): boolean;
  }

  // Container
  class Container extends DisplayObject {
    children: DisplayObject[];
    constructor();
    addChild(...children: DisplayObject[]): DisplayObject;
    addChildAt(child: DisplayObject, index: number): DisplayObject;
    removeChild(...children: DisplayObject[]): boolean;
    removeChildAt(...indices: number[]): boolean;
    removeAllChildren(): void;
    getChildAt(index: number): DisplayObject;
    getChildByName(name: string): DisplayObject | null;
    sortChildren(compareFn: (a: DisplayObject, b: DisplayObject) => number): void;
    getChildIndex(child: DisplayObject): number;
    getNumChildren(): number;
    swapChildrenAt(index1: number, index2: number): void;
    swapChildren(child1: DisplayObject, child2: DisplayObject): void;
    setChildIndex(child: DisplayObject, index: number): void;
    contains(child: DisplayObject): boolean;
    hitTest(x: number, y: number): boolean;
    getObjectsUnderPoint(x: number, y: number): DisplayObject[];
    getObjectUnderPoint(x: number, y: number): DisplayObject | null;
    clone(recursive?: boolean): Container;
    toString(): string;
  }

  // Stage
  class Stage extends Container {
    static _snapToPixelEnabled: boolean;
    autoClear: boolean;
    canvas: HTMLCanvasElement | string | null;
    mouseX: number;
    mouseY: number;
    onMouseMove: ((event: any) => void) | null;
    onMouseUp: ((event: any) => void) | null;
    onMouseDown: ((event: any) => void) | null;
    snapToPixelEnabled: boolean;
    mouseInBounds: boolean;
    tickOnUpdate: boolean;
    mouseMoveOutside: boolean;
    constructor(canvas: HTMLCanvasElement | string);
    update(...args: any[]): void;
    tick(...args: any[]): void;
    handleEvent(event: any): void;
    clear(): void;
    toDataURL(backgroundColor?: string, mimeType?: string): string;
    enableMouseOver(frequency?: number): void;
    enableDOMEvents(enable?: boolean): void;
    clone(): Stage;
    toString(): string;
  }

  // MouseEvent
  class MouseEvent {
    type: string;
    stageX: number;
    stageY: number;
    target: any;
    nativeEvent: Event | null;
    pointerID: number;
    primary: boolean;
    rawX: number;
    rawY: number;
    constructor(type: string, stageX: number, stageY: number, target: any, nativeEvent: Event | null, pointerID: number, primary: boolean, rawX: number, rawY: number);
  }

  // Utility
  function createCanvas(): HTMLCanvasElement;
}

