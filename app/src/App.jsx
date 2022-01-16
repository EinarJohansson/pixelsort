import './App.css'
import { useState, useEffect, useRef } from 'react'
import init from 'wasm'

const App = () =>  {
  const [image, setImage] = useState("")
  const canvasRef = useRef(null)
  const didMountRef = useRef(false);

  useEffect( () => {
    const doSum = async () => {
      let mod = await init()
      console.log(mod)
  
      const img_data = await getImageData(image)
      console.log(img_data);

      const bytes = img_data.data.byteLength;
      console.log("bytes: " + bytes);

      const ptr = mod.alloc(bytes) // Funkar!
      console.log("ptr: " + ptr);
      
      const mem = new Uint8Array(mod.memory.buffer, ptr, bytes); 
      
      console.log("mem: ");
      mem.set(img_data.data);
      console.log(mem);

      const first = mod.first_elem(ptr, bytes)
      console.log("first: " + first);
    }
    
    if (didMountRef.current)
      doSum()

    didMountRef.current = true;
  }, [image])

  const handleChange = e => {
    const file = e.target.files[0]
    if (file) 
      setImage(URL.createObjectURL(file))
  }

  const getImageData = file => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const img = new Image()
      img.src = file

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve( ctx.getImageData(0, 0, canvas.width, canvas.height) )
      }
      img.onerror = e => reject(e)
    })
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

export default App;
