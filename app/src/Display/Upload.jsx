const Upload = props => {
  const handleChange = e => {
    const file = e.target.files[0]
    if (file)
      props.setImage(URL.createObjectURL(file))
  }

  return (
    <>
      <input type="file" onChange={handleChange} />
    </>
  )
}

export default Upload