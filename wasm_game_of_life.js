/* tslint:disable */
import * as wasm from './wasm_game_of_life_bg';

const __wbg_f_random_random_n_target = Math.random;

export function __wbg_f_random_random_n() {
    return __wbg_f_random_random_n_target();
}

const TextDecoder = typeof self === 'object' && self.TextDecoder
    ? self.TextDecoder
    : require('util').TextDecoder;

let cachedDecoder = new TextDecoder('utf-8');

let cachedUint8Memory = null;
function getUint8Memory() {
    if (cachedUint8Memory === null ||
        cachedUint8Memory.buffer !== wasm.memory.buffer)
        cachedUint8Memory = new Uint8Array(wasm.memory.buffer);
    return cachedUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedDecoder.decode(getUint8Memory().slice(ptr, ptr + len));
}

let cachedUint32Memory = null;
function getUint32Memory() {
    if (cachedUint32Memory === null ||
        cachedUint32Memory.buffer !== wasm.memory.buffer)
        cachedUint32Memory = new Uint32Array(wasm.memory.buffer);
    return cachedUint32Memory;
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null)
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    return cachedGlobalArgumentPtr;
}

function getGlobalArgument(arg) {
    const idx = globalArgumentPtr() / 4 + arg;
    return getUint32Memory()[idx];
}

export class Universe {

                static __construct(ptr) {
                    return new Universe(ptr);
                }

                constructor(ptr) {
                    this.ptr = ptr;
                }

            free() {
                const ptr = this.ptr;
                this.ptr = 0;
                wasm.__wbg_universe_free(ptr);
            }
        static new() {
    return Universe.__construct(wasm.universe_new());
}
tick() {
    return wasm.universe_tick(this.ptr);
}
rand_gen() {
    return wasm.universe_rand_gen(this.ptr);
}
toggle_cell(arg0, arg1) {
    return wasm.universe_toggle_cell(this.ptr, arg0, arg1);
}
clear() {
    return wasm.universe_clear(this.ptr);
}
width() {
    return wasm.universe_width(this.ptr);
}
height() {
    return wasm.universe_height(this.ptr);
}
bytes() {
    return wasm.universe_bytes(this.ptr);
}
cells() {
    return wasm.universe_cells(this.ptr);
}
render() {
    const ret = wasm.universe_render(this.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

