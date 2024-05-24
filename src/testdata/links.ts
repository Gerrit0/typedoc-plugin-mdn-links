/// <reference types="@webgpu/types" />
export type GLContext = WebGLRenderingContext;

export type AE = AnimationEvent;

export type Controller = AbortController;

export type Inf = typeof Infinity;
export type DTF = typeof Intl.DateTimeFormat;

export type AContext = AudioContext;

type NotOnMdnImpl = "NotOnMdn";
export type NotOnMdn = NotOnMdnImpl;
export type WGpuDevice = GPUDevice;

export type NumberIterable = Iterable<number>;

/**
 * Links:
 * - {@link !WebGLRenderingContext}
 * - {@link !NaN}
 * - {@link !Intl.DateTimeFormat}
 * - {@link !Intl.DateTimeFormat | custom}
 * Shows up as `{ AbortSignal: { abort_static: {} }}` in compat data
 * - {@link !AbortSignal.abort}
 * Response has both a static and an instance method named `json`
 * - {@link !Response.json} - static
 * - {@link !Response#json} - instance
 * Should not link an improper use of a name containing _static,
 * even though that's what comes from browser-compat-data
 * - {@link !AbortSignal.abort_static}
 * - {@link !Iterable}
 */
export const comment = true;
