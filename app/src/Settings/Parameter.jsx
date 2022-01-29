const Parameter = props => {
  const update = () => {
    if (!props.checked) {
      props.setSelected(props.index)
      props.setSorted(false)
    }
  }

  return (
    <>
      <input onChange={update} type="checkbox" id={props.id} checked={props.checked}/>
      <label htmlFor={props.id}>{props.id}</label>
    </>
  )
}

export default Parameter