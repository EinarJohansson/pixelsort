use wasm_bindgen::prelude::*;

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
pub fn first_elem(ptr: *mut u8, len: usize) -> u8 {
  // create a Vec<u8> from the pointer to the
  // linear memory and the length
  unsafe {
    // actually compute the sum and return it
    let data = Vec::from_raw_parts(ptr, len, len);
    data[0]
  }
}