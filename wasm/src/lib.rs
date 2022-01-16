use wasm_bindgen::{prelude::*};

struct SRGB(u8, u8, u8);

struct Image {
  pixels: Vec<SRGB>
}

impl Image {
  fn new(data: &mut Vec<u8>, height: usize, width: usize) -> Self {
    unsafe {
      let pixels: Vec<SRGB> =
        data
        .chunks_mut(3)
        .map(|rgb| SRGB(rgb[0], rgb[1], rgb[2]))
        .collect();

      Self {pixels }
    }
  }
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
pub fn sort(ptr: *mut u8, len: usize) {
  // create a Vec<u8> from the pointer to the
  // linear memory and the length
  unsafe {
    let mut data= Vec::from_raw_parts(ptr, len, len);

    // invert
    for i in (0..data.len()).step_by(4) {
      data[i] = 255 - data[i]; //r
      data[i+1] = 255 - data[i+1]; //g
      data[i+2] = 255 - data[i+2]; //b
    }
  }
}