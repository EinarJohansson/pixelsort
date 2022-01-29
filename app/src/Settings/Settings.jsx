import { useState } from "react"
import Parameter from "./Parameter"

const paramaters = [
  {
    'id': 'red',
    'min': 0,
    'max': 255,
    'default': 100
  },
  {
    'id': 'blue',
    'min': 0,
    'max': 255,
    'default': 100
  },
  {
    'id': 'green',
    'min': 0,
    'max': 255,
    'default': 100
  }
]

const Settings = props => {
  const thresholdChange = e => {
    props.setThreshold(e.target.value)
    props.setSorted(false)
  }
  return (
    <div>
      {paramaters.map((parameter, index) => {
        return (
          <div key={index}>
            <Parameter 
              id={parameter.id} 
              index={index} 
              checked={index === props.mode} 
              setSelected={props.setMode}
              setSorted={props.setSorted}
              />
          </div>
        )
      })}


      <input value={props.threshold} onChange={thresholdChange} type="range" {...paramaters[props.mode]} />
      <label htmlFor="">{paramaters[props.mode].id} threshold</label>

    </div>
  )
}

export default Settings