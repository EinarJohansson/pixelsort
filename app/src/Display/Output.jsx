import { useEffect, useRef } from 'react'

const Output = props => {
  const canvasRef = useRef(null)

  const show = img => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })

    const tmp = new Image();
    tmp.onload = () => {
      // Reduces the amount of pixels to work with if big image
      const scale = (tmp.height > 3000 || tmp.width > 3000) ? 2 : 1;

      canvas.width = tmp.width / scale;
      canvas.height = tmp.height / scale;

      ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height)
      props.setData(ctx.getImageData(0, 0, canvas.width, canvas.height))
    }
    tmp.src = img;
  }

  useEffect(() => {
    if (props.image) {
      show(props.image)
    }
  }, [props.image])

  return (
    <>
      <canvas id={"canvas"} ref={canvasRef} />
    </>
  )
}

export default Output