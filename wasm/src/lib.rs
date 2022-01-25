extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;

#[derive(Clone, Copy)]
pub struct RGBA(u8, u8, u8, u8);

// Macro for console logs
macro_rules! console_log {
  ($($t:tt)*) => (web_sys::console::log_1(&format!($($t)*).into()))
}

#[wasm_bindgen]
pub struct ImageHandle {
  data: Vec<u8>,
  width: usize,
  height: usize,
}

#[wasm_bindgen]
impl ImageHandle {
  #[wasm_bindgen(constructor)]
  pub fn new(ptr: *mut u8, len: usize, width: usize, height: usize) -> ImageHandle {
    unsafe {
      let data: Vec<u8> = Vec::from_raw_parts(ptr, len, len);
      ImageHandle {
        data,
        width,
        height,
      }
    }
  }

  pub fn counting_sort(&mut self) {
    // Counting sort
    const CHUNK_SIZE: usize = 4;
    const COLOR_INDEX: usize = 1;
    const K: usize = u8::MAX as usize + 1;

    let pixels: Vec<RGBA> = self.data
      .chunks_exact(CHUNK_SIZE)
      .map(|pixel| RGBA(pixel[0], pixel[1], pixel[2], pixel[3]))
      .collect();

    let n: usize = pixels.len();

    let mut hist: Vec<usize> = vec![0; K];

    for val in pixels.iter() {
      hist[val.1 as usize] += 1; // color index 1
    }

    for i in 1..K {
      hist[i] += hist[i - 1];
    }

    let mut sorted: Vec<RGBA> = vec![RGBA(0, 0, 0, 0); n];

    for i in (0..n).rev() {
      let index = pixels[i].1 as usize;
      sorted[hist[index] as usize - 1] = pixels[i];
      hist[index] -= 1;
    }

    for i in 0..n {
      self.data[(4 * i) + 0] = sorted[i].0;
      self.data[(4 * i) + 1] = sorted[i].1;
      self.data[(4 * i) + 2] = sorted[i].2;
      self.data[(4 * i) + 3] = sorted[i].3;
    }
  }

  pub fn sort(&mut self) {
    const CHUNK_SIZE: usize = 4;

    let mut pixels: Vec<RGBA> = self
      .data
      .chunks_exact_mut(CHUNK_SIZE)
      .map(|rgba| RGBA(rgba[0], rgba[1], rgba[2], rgba[3]))
      .collect();

    let sorted: Vec<&mut RGBA> = pixels
      .chunks_exact_mut(self.width)
      .flat_map(|f| {
        f.sort_by(|a, b| a.0.cmp(&b.0));
        f
      })
      .collect();

    for (i, pix) in self.data.chunks_exact_mut(CHUNK_SIZE).enumerate() {
      pix[0] = sorted[i].0;
      pix[1] = sorted[i].1;
      pix[2] = sorted[i].2;
      pix[3] = sorted[i].3;
    }
  }
}

#[wasm_bindgen]
pub fn init_panic_hook() {
  console_error_panic_hook::set_once();
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
