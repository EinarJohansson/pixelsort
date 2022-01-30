import './App.css'
import './Display/Display'
import './Settings/Settings'

import { useEffect, useState  } from 'react'
import init, {ImageHandle} from 'wasm'
import Display from './Display/Display'
import Settings from './Settings/Settings'

const App = () =>  {
  const [OGdata, setOGData] = useState(null)
  const [data, setData] = useState(null)
  const [mod, setMod] = useState(null)
  const [sorted, setSorted] = useState(false)
  const [mode, setMode] = useState(0) 
  const [threshold, setThreshold] = useState(0) 


  useEffect(() => {
    const initMod = async () => {
      let tmp = await init()
      tmp.init_panic_hook()
      setMod(tmp)
    }
    initMod()
  }, [])

  const sort = () => {
    if (!mod) {
      console.error("Could not load wasm module")
      return
    }
    
    // How many bytes we want to allocate on WASM's linear memory
    const bytes = OGdata.data.byteLength
    // Get a pointer to the newly allocated buffer
    const ptr = mod.alloc(bytes)
    // Create a handle to the WASM's linear memory
    const mem = new Uint8Array(mod.memory.buffer, ptr, bytes) 
      
    // Update WASM memory with the new image buffer
    mem.set(OGdata.data)

    const width = OGdata.width
    const height = OGdata.height

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

    const new_data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setData(new_data)
    setSorted(true)
  }

  return (
    <div className="App">
      <Display 
        setData={setData}
        setOGData={setOGData}
        setSorted={setSorted}
      />
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
