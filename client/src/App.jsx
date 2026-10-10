import { useRef, useState } from 'react'
import './App.css'



function App() {
  const [view, setView] = useState('home')
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [submittedDrawings, setSubmittedDrawings] = useState([])

  const startDrawing = (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

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