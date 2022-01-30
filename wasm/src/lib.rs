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

  fn count_sort(&self, row: &[RGBA], mode: u8) -> Vec<RGBA> {
    // Counting sort algorithm, time complexity: O(self.width + 255)

    // Range for the element in list -> [0, 255] -> 256 differet values. 
    let k: usize = u8::MAX as usize + 1;

    // Histogram for counting occurences of elements
    let mut hist: Vec<usize> = vec![0; k];

    // Count the elements
    for val in row.iter() {
      let index = match mode {
        0 => val.0, // red
        1 => val.1, // green
        2 => val.2, // blue
        _ => val.0  // Default to red
      };
      hist[index as usize] +=1;
    }

    // Cumulative sum
    for i in 1..k {
      hist[i] += hist[i - 1];
    }

    // Vector for the sorted row
    let mut sorted: Vec<RGBA> = vec![RGBA(0, 0, 0, 0); self.width];

    // Add values in ascending order
    for i in (0..self.width).rev() {
      let index = match mode {
        0 => row[i].0, // red
        1 => row[i].1, // green 
        2 => row[i].2, // blue
        _ => row[i].0  // Default to red
      };

      sorted[hist[index as usize] as usize - 1] = row[i];
      hist[index as usize] -= 1;
    }
    sorted
  }

  pub fn sort(&mut self, mode: u8, threshold: u8) {
    // Sort image row by row
    let chunk_size: usize = 4;

    // Gather all RGBA pixels in the image
    let pixels: Vec<RGBA> = self.data
      .chunks_exact(chunk_size)
      .map(|pixel| RGBA(pixel[0], pixel[1], pixel[2], pixel[3]))
      .collect();
    
    // Sort pixels row by row
    let sorted: Vec<RGBA> = pixels
      .chunks_exact(self.width)
      .flat_map(|row| {
        self.count_sort(row, mode)
      })
      .collect();

    // Write the sorted buffer to memory
    for (i, pixel) in self.data.chunks_exact_mut(chunk_size).enumerate() {
      let x = match mode {
        0 => sorted[i].0, // red
        1 => sorted[i].1, // green
        2 => sorted[i].2, // blue
        _ => sorted[i].0  // Default to red
      };

      if x <= threshold { continue; }

      pixel[0] = sorted[i].0;
      pixel[1] = sorted[i].1;
      pixel[2] = sorted[i].2;
      pixel[3] = sorted[i].3;
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
