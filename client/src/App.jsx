import { useRef, useState, useEffect } from 'react'
import { animate } from 'animejs'
import { io } from 'socket.io-client'
import './App.css'

// Socket.IO connection
const socket = io('http://localhost:3001')

function App() {
  const [view, setView] = useState('home')
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [submittedDrawings, setSubmittedDrawings] = useState([])

  // Drawing tools
  const [brushColor, setBrushColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [isErasing, setIsErasing] = useState(false)

  // Receive drawings from the Socket.IO server
  useEffect(() => {
    const receiveDrawing = (image) => {
      setSubmittedDrawings(prevDrawings => [...prevDrawings, image])
    }

    socket.on('new-drawing', receiveDrawing)

    return () => {
      socket.off('new-drawing', receiveDrawing)
    }
  }, [])

  // Start drawing
  const startDrawing = (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.globalCompositeOperation = isErasing
      ? 'destination-out'
      : 'source-over'

    context.strokeStyle = brushColor
    context.lineWidth = brushSize
    context.lineCap = 'round'
    context.lineJoin = 'round'

    context.beginPath()
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)

    setIsDrawing(true)
  }

  // Continue drawing
  const draw = (event) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    context.stroke()
  }

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false)
  }

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Send drawing to the Socket.IO server
  const submitDrawing = () => {
    const canvas = canvasRef.current
    const image = canvas.toDataURL('image/png')

    socket.emit('submit-drawing', image)
    setView('display')
  }

  return (
    <div>
      {/* HOME SCREEN */}
      {view === 'home' && (
        <>
          <h1 className="text-4xl font-bold text-purple-500">
            Drawing App
          </h1>

          <p>Research Milestone Prototype</p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setView('display')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Main Display
            </button>

            <button
              onClick={() => setView('controller')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Controller
            </button>
          </div>
        </>
      )}

      {/* MAIN DISPLAY */}
      {view === 'display' && (
        <>
          <h1>Main Display</h1>

          {submittedDrawings.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {submittedDrawings.map((image, index) => (
                <img
                  key={index}
                  ref={(element) => {
                    if (element) {
                      animate(element, {
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        duration: 600,
                        ease: 'out(3)',
                      })
                    }
                  }}
                  src={image}
                  alt={`Drawing ${index + 1}`}
                  width="250"
                  height="200"
                  style={{
                    margin: '10px',
                    backgroundColor: 'white',
                  }}
                />
              ))}
            </div>
          ) : (
            <p>No drawings submitted yet.</p>
          )}

          <button
            onClick={() => setView('home')}
            className="mt-4 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            Back
          </button>
        </>
      )}

      {/* CONTROLLER */}
      {view === 'controller' && (
        <>
          <p>Draw Something Below:</p>

          {/* Brush settings */}
          <div className="flex justify-center items-center gap-3 my-2">
            <label className="flex items-center gap-3 border-2 border-purple-300 bg-purple-50 rounded-xl px-4 py-3 text-gray-700">
              Brush Color:
              <input
                type="color"
                value={brushColor}
                onChange={(event) => setBrushColor(event.target.value)}
                className="w-8 h-8 cursor-pointer"
              />
            </label>

            <label className="flex items-center gap-3 border-2 border-purple-300 bg-purple-50 rounded-xl px-4 py-3 text-gray-700">
              Brush Size: {brushSize}px
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(event) =>
                  setBrushSize(Number(event.target.value))
                }
                className="accent-purple-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Brush and Eraser */}
          <div className="flex justify-center gap-3 my-4">
            <button
              onClick={() => setIsErasing(false)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-colors"
            >
              Brush
            </button>

            <button
              onClick={() => setIsErasing(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-colors"
            >
              Eraser
            </button>
          </div>

          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            width="500"
            height="300"
            className="block mx-auto"
            style={{
              border: '2px solid black',
              backgroundColor: 'white',
            }}
          />

          {/* Drawing actions */}
          <div className="flex justify-center gap-3 mt-2">
            <button
              onClick={clearCanvas}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Clear
            </button>

            <button
              onClick={submitDrawing}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Submit Drawing
            </button>
          </div>

          <button
            onClick={() => setView('home')}
            className="mt-4 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            Back
          </button>
        </>
      )}
    </div>
  )
}

export default App