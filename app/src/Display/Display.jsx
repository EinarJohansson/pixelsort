// react
import { useState, useEffect } from 'react'
// Css 
import './Display.css'
// Components
import Input from './Input'
import Upload from './Upload'
import Output from './Output'

// Visar Input, knapp för att ladda upp bild, Output i en grid.
const Display = props => {
  const [image, setImage] = useState("")

  useEffect(() => {
    props.setSorted(false)
  }, [image])

  return (
    <div id="display">
      <Input src={image} />
      <Upload setImage={setImage} />
      <Output setData={props.setData} setOGData={props.setOGData} image={image} />
    </div>
  )
}

export default Display