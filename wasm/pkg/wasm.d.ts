/* tslint:disable */
/* eslint-disable */
/**
* Allocate memory into the module's linear memory
* and return the offset to the start of the block.
* @param {number} len
* @returns {number}
*/
export function alloc(len: number): number;
/**
* Given a pointer to the start of a byte array and
* its length, return the sum of its elements.
* @param {number} ptr
* @param {number} len
*/
export function sort(ptr: number, len: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly alloc: (a: number) => number;
  readonly sort: (a: number, b: number) => void;
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
