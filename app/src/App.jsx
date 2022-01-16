import './App.css'
import { useState, useEffect, useRef } from 'react'
import init from 'wasm'

const App = () =>  {
  const [image, setImage] = useState("")
  const canvasRef = useRef(null)
  const didMountRef = useRef(false)
  
const getImageData = () => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const img = new Image()
      img.src = image

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve( ctx.getImageData(0, 0, canvas.width, canvas.height) )
      }
      img.onerror = e => reject(e)
    })
  }

  useEffect( () => {
    const initCanvas = async () => {
      let mod = await init()
      console.log(mod)

      console.log('memory: ');
      console.log(mod.memory.buffer);
  
      const img_data = await getImageData()
      console.log(img_data)

      const bytes = img_data.data.byteLength
      console.log("bytes: " + bytes)

      const ptr = mod.alloc(bytes)
      console.log("ptr: " + ptr)
      
      const mem = new Uint8Array(mod.memory.buffer, ptr, bytes) 
      
      console.log("mem: ")
      mem.set(img_data.data)
      console.log(mem)

      mod.sort(ptr, bytes)

      const new_mem = new Uint8ClampedArray(mod.memory.buffer, ptr, bytes)
      console.log(new_mem);

      img_data.data.set(new_mem)

      console.log(img_data);
      
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      ctx.putImageData(img_data,0,0);
    }
    
    if (didMountRef.current)
      initCanvas()

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
