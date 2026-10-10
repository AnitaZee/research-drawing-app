import { useRef, useState } from 'react'
import './App.css'



function App() {
  const [view, setView] = useState('home')
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [submittedDrawings, setSubmittedDrawings] = useState([])
  //color
  const [brushColor, setBrushColor] = useState('#000000')
  //brushsize
  const [brushSize, setBrushSize] = useState(5)
  //the eraser is not just paint over with white
  //it removes pixels from canvas
  const [isErasing, setIsErasing] = useState(false)


  const startDrawing = (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.globalCompositeOperation = isErasing
  //erases existing pixels
    ? 'destination-out'
  //normal drawing mode
     : 'source-over'

    context.strokeStyle = brushColor

    context.lineWidth = brushSize
    context.lineCap = 'round'
    context.lineJoin = 'round'

    context.beginPath()
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)

    setIsDrawing(true)



  }

  const draw = (event) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    context.stroke()

  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.clearRect(0,0, canvas.width, canvas.height)

  }

  const submitDrawing = () => {
    const canvas = canvasRef.current

    const image = canvas.toDataURL('image/png')

    setSubmittedDrawings(pervDrawings => [...pervDrawings, image])
    setView('display')

  }

  return (
    <div>
      {view === 'home' && (
        <>
          <h1>Drawing App</h1>
          <p>Research Milestone Prototype</p>

          <button onClick={() => setView('display')}>
            Main Display
          </button>

          <button onClick={() => setView('controller')}>
            Controller
          </button>
        </>
      )}

      {view === 'display' && (
        <>
          <h1>Main Display</h1>

          {submittedDrawings.length > 0 ? (
            <div>
              {submittedDrawings.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Drawing ${index + 1}`}
                  width="250"
                  height="200"
                  style={{ margin: '10px', backgroundColor: 'white' }}
                />
             ))}
      </div>
    ) : (
      <p>No drawings submitted yet.</p>
    )}

    <br />

          <button onClick={() => setView('home')}>
            Back 
          </button>  
        </>
      )}

      {view === 'controller' && (
        <>

          <p>Draw Something Below:</p>

          
          <label>
            Brush Color:
            <input
              type = "color"
              value = {brushColor}
              onChange={(event) => setBrushColor(event.target.value)}
            />
          </label>

          <label>
            Brush Size: {brushSize}px
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(event) => setBrushSize(Number(event.target.value))}
            />
          </label>

          <button onClick={() => setIsErasing(false)}>
            Brush
          </button>

          <button onClick={() => setIsErasing(true)}>
            Eraser
          </button>


          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            width="500"
            height="400"
            style={{
              border: '2px solid black',
              backgroundColor: 'white'
            }}
          />

          <br />
          <button onClick={clearCanvas}>
            Clear
            </button>
            
          <button onClick = {submitDrawing}>
            Submit Drawing
          </button>

          <br />

          <button onClick={() => setView('home')}>
            Back
          </button> 

        </>
      )}
    </div>
  )
}

export default App