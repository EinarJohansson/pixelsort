extern crate console_error_panic_hook;
use wasm_bindgen::prelude::*;
struct RGBA(u8, u8, u8, u8);

use std::panic;

#[wasm_bindgen]
pub fn init_panic_hook() {
  console_error_panic_hook::set_once();
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_usize(a: usize);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u8(a: u8);
}

/// Allocate memory into the module's linear memory
/// and return the offset to the start of the block.
#[wasm_bindgen]
#[no_mangle]
pub fn alloc(len: usize) -> *mut u8 {
  // create a new mutable buffer with capacity `len`
  let mut buf = Vec::with_capacity(len);
  // take a mutable pointer to the buffer
  let ptr = buf.as_mut_ptr();
  // take ownership of the memory block and
  // ensure that its destructor is not
  // called when the object goes out of scope
  // at the end of the function
  std::mem::forget(buf);
  // return the pointer so the runtime
  // can write data at this offset
  return ptr;
}

/// Given a pointer to the start of a byte array and
/// its length, return the sum of its elements.
#[wasm_bindgen]
#[no_mangle]
pub fn sort(ptr: *mut u8, len: usize, width: usize, height: usize) {
  unsafe {
    log_usize(width);
    log_usize(height);

    const CHUNK_SIZE: usize = 4;

    let mut data= Vec::from_raw_parts(ptr, len, len);

    let mut pixels: Vec<RGBA> = 
      data
      .chunks_exact_mut(CHUNK_SIZE)
      .map(|rgba| RGBA(rgba[0], rgba[1], rgba[2],rgba[3]))
      .collect();

    let sorted: Vec<&mut RGBA> = 
      pixels
      .chunks_exact_mut(width)
      .flat_map(|f| {
        f.sort_by(|a, b| a.0.cmp(&b.0));
        f
      }
      )
      .collect();

    for (i, pix) in data.chunks_exact_mut(CHUNK_SIZE).enumerate() {
      pix[0] = sorted[i].0;
      pix[1] = sorted[i].1;
      pix[2] = sorted[i].2;
      pix[3] = sorted[i].3;
    }
  }
}