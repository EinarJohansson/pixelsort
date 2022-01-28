import './App.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import init, {ImageHandle} from 'wasm'

const App = () =>  {
  const [image, setImage] = useState("")
  const canvasRef = useRef(null)
  const didMountRef = useRef(false)
  
const getImageData = useCallback(() => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { alpha: false })

      const img = new Image()
      img.src = image

      img.onload = () => {
        // Reduces the amount of pixels to work with if big image
        const scale = (img.height > 3000 || img.width > 3000) ? 2 : 1;

        console.log('width: ', img.width);
        console.log('scale: ', scale);

        canvas.width = img.width / scale;
        canvas.height = img.height / scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        resolve( ctx.getImageData(0, 0, canvas.width, canvas.height) )
      }
      img.onerror = e => reject(e)
    })
  }, [image])

  useEffect( () => {
    const updateCanvas = async () => {
      // Load wasm functionality
      let mod = await init()

      // More descriptive error messages
      mod.init_panic_hook()

      // Load the current image data
      const img_data = await getImageData()

      // How many bytes we want to allocate on WASM's linear memory
      const bytes = img_data.data.byteLength
      // Get a pointer to the newly allocated buffer
      const ptr = mod.alloc(bytes)
      
      // Create a handle to the WASM's linear memory
      const mem = new Uint8Array(mod.memory.buffer, ptr, bytes) 
      
      // Update WASM memory with the new image buffer
      mem.set(img_data.data)

      const width = img_data.width
      const height = img_data.height

      // Create a handle to our image
      let img_handle = new ImageHandle(ptr, bytes, width, height);

      // Sort the pixels
      var startTime = performance.now()
      img_handle.sort()
      var endTime = performance.now()
      console.log(`Sorting took ${endTime - startTime} milliseconds`)

      // Create a new handle to the updated memory
      const new_mem = new Uint8ClampedArray(mod.memory.buffer, ptr, bytes)
      
      // Set the canvas image to the modifyed image
      img_data.data.set(new_mem)
      
      // Get our output canvas
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { alpha: false })

      // Draw our updated image
      ctx.putImageData(img_data, 0, 0);
    }
    
    // Check if we have mounted the component or not
    if (didMountRef.current)
      updateCanvas()

    didMountRef.current = true
  }, [image, getImageData])

  const handleChange = e => {
    const file = e.target.files[0]
    if (file)
      setImage(URL.createObjectURL(file))
  }

  return (
    <div className="App">
      <div id='grid'>
        <img alt="input" src={image} style={{visibility: !didMountRef.current ? "hidden" : "visible"}}/>
        <input type="file" onChange={handleChange} />
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default App
