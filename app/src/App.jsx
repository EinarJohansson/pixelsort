import './App.css'
import './Display/Display'
import './Settings/Settings'

import { useEffect, useRef, useState  } from 'react'
import init, {ImageHandle} from 'wasm'
import Display from './Display/Display'
import Settings from './Settings/Settings'

const App = () =>  {
  const [data, setData] = useState(null)
  const [mod, setMod] = useState(null)
  const [sorted, setSorted] = useState(false)

  /* 
  0 -> red 
  1 -> green
  3 -> blue
  */
  const [mode, setMode] = useState(0) 
  const [threshold, setThreshold] = useState(0) 


  useEffect(async () => {
    let tmp = await init()
    tmp.init_panic_hook()
    setMod(tmp)
  }, [])

  const sort = () => {
    if (!mod) {
      console.error("Could not load wasm module")
      return
    }
    // How many bytes we want to allocate on WASM's linear memory
    const bytes = data.data.byteLength
    // Get a pointer to the newly allocated buffer
    const ptr = mod.alloc(bytes)
    // Create a handle to the WASM's linear memory
    const mem = new Uint8Array(mod.memory.buffer, ptr, bytes) 
      
    // Update WASM memory with the new image buffer
    mem.set(data.data)

    const width = data.width
    const height = data.height

    // Create a handle to our image
    let img_handle = new ImageHandle(ptr, bytes, width, height);

    // Sort the pixels
    var startTime = performance.now()
    console.log('mode: ', mode);
    console.log('thresh: ', threshold);
    img_handle.sort(mode, threshold)
    var endTime = performance.now()
    console.log(`Sorting took ${endTime - startTime} milliseconds`)

    // Create a new handle to the updated memory
    const new_mem = new Uint8ClampedArray(mod.memory.buffer, ptr, bytes)
    
    // Set the canvas image to the modifyed image
    data.data.set(new_mem)
    
    // Get our output canvas
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d', { alpha: false })

    // Draw our updated image
    ctx.putImageData(data, 0, 0);
    setSorted(true)
  }

  return (
    <div className="App">
      <Display setData={setData} setSorted={setSorted}/>
      <button disabled={sorted || !data} onClick={sort}>Sort the image!</button>
      <Settings 
        setMode={setMode}
        mode={mode} 
        setThreshold={setThreshold} 
        threshold={threshold} 
        setSorted={setSorted}
      />
    </div>
  )
}

export default App
