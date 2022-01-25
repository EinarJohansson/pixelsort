/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_panic_hook(): void;
/**
* Allocate memory into the module's linear memory
* and return the offset to the start of the block.
* @param {number} len
* @returns {number}
*/
export function alloc(len: number): number;
/**
*/
export class ImageHandle {
  free(): void;
/**
* @param {number} ptr
* @param {number} len
* @param {number} width
* @param {number} height
*/
  constructor(ptr: number, len: number, width: number, height: number);
/**
*/
  counting_sort(): void;
/**
*/
  sort(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_imagehandle_free: (a: number) => void;
  readonly imagehandle_new: (a: number, b: number, c: number, d: number) => number;
  readonly imagehandle_counting_sort: (a: number) => void;
  readonly imagehandle_sort: (a: number) => void;
  readonly init_panic_hook: () => void;
  readonly alloc: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
