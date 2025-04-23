"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { CheckIcon, DownloadIcon, Eraser, RefreshCcwIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface Point {
  x: number
  y: number
  pressure?: number
}

interface LocalSignatureRef {
  clear: () => void
}

interface SignatureProps {
  className?: string
  options?: {
    smoothing?: number
    streamline?: number
    thinning?: number
  }
  readonly?: boolean
  name?: string
  onChange?: (dataURL: string | null) => void
  ref?: React.RefObject<LocalSignatureRef>
}

export function SignaturePad({
  className,
  options = {
    smoothing: 0,
    streamline: 0.5,
    thinning: 0.5,
  },
  readonly = false,
  name,
  onChange,
}: SignatureProps) {
  const [isSigned, setIsSigned] = useState(false)
  const [isReadonly, setIsReadonly] = useState(readonly)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawing = useRef(false)
  const lastPoints = useRef<Point[]>([])
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()

  // Apply smoothing to points
  const getControlPoints = (p1: Point, p2: Point, p3: Point, t: number): [Point, Point] => {
    const d1 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    const d2 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2))

    const fa = (t * d1) / (d1 + d2)
    const fb = (t * d2) / (d1 + d2)

    const cp1 = {
      x: p2.x - fa * (p3.x - p1.x),
      y: p2.y - fa * (p3.y - p1.y),
    }

    const cp2 = {
      x: p2.x + fb * (p3.x - p1.x),
      y: p2.y + fb * (p3.y - p1.y),
    }

    return [cp1, cp2]
  }

  // Draw a smooth line using bezier curves
  const drawSmoothLine = (points: Point[], context: CanvasRenderingContext2D) => {
    if (points.length < 3) {
      // Not enough points for a curve, draw a straight line
      context.beginPath()
      context.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y)
      }
      context.stroke()
      return
    }

    context.beginPath()
    context.moveTo(points[0].x, points[0].y)

    // Draw curves between points
    for (let i = 1; i < points.length - 1; i++) {
      const [cp1, cp2] = getControlPoints(points[i - 1], points[i], points[i + 1], options.smoothing || 0.5)

      context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, points[i + 1].x, points[i + 1].y)
    }

    context.stroke()
  }

  // Apply streamlining to reduce jitter
  const applyStreamlining = (newPoint: Point, lastPoint: Point, amount: number): Point => {
    return {
      x: lastPoint.x + (newPoint.x - lastPoint.x) * (1 - amount),
      y: lastPoint.y + (newPoint.y - lastPoint.y) * (1 - amount),
      pressure: newPoint.pressure,
    }
  }

  // Apply thinning based on speed
  const applyThinning = (context: CanvasRenderingContext2D, points: Point[], thinning: number) => {
    if (points.length < 2) return

    const baseWidth = 2 // Base line width
    const lastPoint = points[points.length - 2]
    const currentPoint = points[points.length - 1]

    // Calculate speed (distance between points)
    const distance = Math.sqrt(Math.pow(currentPoint.x - lastPoint.x, 2) + Math.pow(currentPoint.y - lastPoint.y, 2))

    // Faster movement = thinner line, with a minimum width
    const speedFactor = Math.max(0.5, 1 - distance * thinning * 0.1)
    context.lineWidth = baseWidth * speedFactor
  }

  const updateSignatureValue = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const isEmpty = isCanvasEmpty(canvas)

    if (!isEmpty) {
      const dataURL = canvas.toDataURL("image/png")
      setIsSigned(true)

      // Update hidden input if in a form
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = dataURL
      }

      // Call onChange if provided
      if (onChange) {
        onChange(dataURL)
      }
    } else {
      setIsSigned(false)

      // Clear hidden input if in a form
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = ""
      }

      // Call onChange if provided
      if (onChange) {
        onChange(null)
      }
    }
  }

  // Check if canvas is empty
  const isCanvasEmpty = (canvas: HTMLCanvasElement): boolean => {
    const context = canvas.getContext("2d")
    if (!context) return true

    const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer)

    return !pixelBuffer.some((color) => color !== 0)
  }

  const addPoint = (x: number, y: number, pressure = 0.5) => {
    if (!contextRef.current) return

    const newPoint = { x, y, pressure }

    // Apply streamlining if we have previous points
    if (lastPoints.current.length > 0 && options.streamline) {
      const lastPoint = lastPoints.current[lastPoints.current.length - 1]
      const streamlinedPoint = applyStreamlining(newPoint, lastPoint, options.streamline)
      lastPoints.current.push(streamlinedPoint)
    } else {
      lastPoints.current.push(newPoint)
    }

    // Keep a limited number of points for performance
    if (lastPoints.current.length > 10) {
      lastPoints.current = lastPoints.current.slice(-10)
    }

    // Apply thinning based on speed
    if (options.thinning && lastPoints.current.length > 1) {
      applyThinning(contextRef.current, lastPoints.current, options.thinning)
    }

    // Draw the smooth line
    drawSmoothLine(lastPoints.current, contextRef.current)

    setIsSigned(true)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isReadonly) return

    const canvas = canvasRef.current
    if (!canvas || !contextRef.current) return

    isDrawing.current = true
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Clear the points array to start a new stroke
    lastPoints.current = []

    // Start a new path
    contextRef.current.beginPath()
    addPoint(x, y)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || isReadonly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    addPoint(x, y)
  }

  const handleMouseUp = () => {
    isDrawing.current = false
    updateSignatureValue()
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isReadonly) return

    const canvas = canvasRef.current
    if (!canvas || !contextRef.current) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    // Get pressure if available (iOS Safari supports this)
    const pressure = (touch as any).force !== undefined ? (touch as any).force : 0.5

    isDrawing.current = true

    // Clear the points array to start a new stroke
    lastPoints.current = []

    // Start a new path
    contextRef.current.beginPath()
    addPoint(x, y, pressure)

    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || isReadonly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    // Get pressure if available
    const pressure = (touch as any).force !== undefined ? (touch as any).force : 0.5

    addPoint(x, y, pressure)

    e.preventDefault()
  }

  const handleTouchEnd = () => {
    isDrawing.current = false
    updateSignatureValue()
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const context = contextRef.current

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      setIsSigned(false)
      setIsReadonly(false)
      lastPoints.current = []
      updateSignatureValue()
    }
  }

  const handleValidate = () => {
    setIsReadonly(!isReadonly)
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = dataURL
    a.download = "signature.png"
    a.click()
  }

  // Initialize canvas on component mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio

    // Scale the context to ensure correct drawing
    const context = canvas.getContext("2d")
    if (!context) return

    context.scale(window.devicePixelRatio, window.devicePixelRatio)

    context.strokeStyle = "oklch(62.3% 0.214 259.815)" 
    context.lineWidth = 2
    context.lineCap = "round"
    context.lineJoin = "round"

    contextRef.current = context
  }, [theme])

  // Update readonly state when prop changes
  useEffect(() => {
    setIsReadonly(readonly)
  }, [readonly])

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm tracking-tight text-neutral-500">Just sign here</p>
      <canvas
        ref={canvasRef}
        className={cn(
          "h-28 w-full rounded-lg border border-neutral-500/20 dark:bg-neutral-300/10 bg-neutral-500/10",
          isReadonly ? "cursor-not-allowed" : "cursor-crosshair",
          className,
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} ref={hiddenInputRef} />}
      <div className="flex justify-end gap-1 text-neutral-700 dark:text-neutral-200">
        <Button
          className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
          onClick={handleValidate}
          type="button"
        >
          {isReadonly ? (
            <>
              <RefreshCcwIcon className="size-5 dark:text-white text-black" />
              <span className="sr-only">Reset</span>
            </>
          ) : (
            <>
              <CheckIcon className="size-5 dark:text-white text-black" />
              <span className="sr-only">Validate</span>
            </>
          )}
        </Button>
        {isReadonly && isSigned && (
          <Button
            className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
            onClick={handleDownload}
            type="button"
          >
            <DownloadIcon className="size-5 dark:text-white text-black" />
            <span className="sr-only">Download</span>
          </Button>
        )}
        {!isReadonly && (
          <Button
            className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
            onClick={handleClear}
            type="button"
          >
            <Eraser className="size-5 dark:text-white text-black" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default SignaturePad






// "use client"

// import type React from "react"
// import Signature, { type SignatureRef } from "@uiw/react-signature";
// import { useRef, useState, useEffect } from "react"
// import { CheckIcon, DownloadIcon, Eraser, RefreshCcwIcon } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { useTheme } from "next-themes"

// interface LocalSignatureRef {
//   clear: () => void
//   svg: SVGSVGElement
// }

// interface SignatureProps {
//   className?: string
//   options?: {
//     smoothing?: number
//     streamline?: number
//     thinning?: number
//   }
//   readonly?: boolean
//   ref?: React.RefObject<LocalSignatureRef>
// }

// export function SignaturePad({
//   className,
//   options = {
//     smoothing: 0,
//     streamline: 0.8,
//     thinning: 0.7,
//   },
//   readonly = false,
// }: SignatureProps) {
//   const [isSigned, setIsSigned] = useState(false)
//   const [isReadonly, setIsReadonly] = useState(readonly)
//   const svgRef = useRef<SVGSVGElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const contextRef = useRef<CanvasRenderingContext2D | null>(null)
//   const isDrawing = useRef(false)
//   const lastPoint = useRef<{ x: number; y: number } | null>(null)

// const {theme, setTheme} = useTheme()

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (isReadonly) return

//     const canvas = canvasRef.current
//     if (!canvas) return

//     isDrawing.current = true
//     const rect = canvas.getBoundingClientRect()
//     lastPoint.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     }
//   }

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing.current || !contextRef.current || !lastPoint.current || isReadonly) return

//     const canvas = canvasRef.current
//     if (!canvas) return

//     const rect = canvas.getBoundingClientRect()
//     const currentPoint = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     }

//     contextRef.current.beginPath()
//     contextRef.current.moveTo(lastPoint.current.x, lastPoint.current.y)
//     contextRef.current.lineTo(currentPoint.x, currentPoint.y)
//     contextRef.current.stroke()

//     lastPoint.current = currentPoint
//     setIsSigned(true)
//   }

//   const handleMouseUp = () => {
//     isDrawing.current = false
//     lastPoint.current = null
//   }

//   const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
//     if (isReadonly) return

//     const canvas = canvasRef.current
//     if (!canvas) return

//     const rect = canvas.getBoundingClientRect()
//     const touch = e.touches[0]

//     isDrawing.current = true
//     lastPoint.current = {
//       x: touch.clientX - rect.left,
//       y: touch.clientY - rect.top,
//     }

//     e.preventDefault()
//   }

//   const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
//     if (!isDrawing.current || !contextRef.current || !lastPoint.current || isReadonly) return

//     const canvas = canvasRef.current
//     if (!canvas) return

//     const rect = canvas.getBoundingClientRect()
//     const touch = e.touches[0]

//     const currentPoint = {
//       x: touch.clientX - rect.left,
//       y: touch.clientY - rect.top,
//     }

//     contextRef.current.beginPath()
//     contextRef.current.moveTo(lastPoint.current.x, lastPoint.current.y)
//     contextRef.current.lineTo(currentPoint.x, currentPoint.y)
//     contextRef.current.stroke()

//     lastPoint.current = currentPoint
//     setIsSigned(true)

//     e.preventDefault()
//   }

//   const handleTouchEnd = () => {
//     isDrawing.current = false
//     lastPoint.current = null
//   }

//   const handleClear = () => {
//     const canvas = canvasRef.current
//     const context = contextRef.current

//     if (canvas && context) {
//       context.clearRect(0, 0, canvas.width, canvas.height)
//       setIsSigned(false)
//       setIsReadonly(false)
//     }
//   }

//   const handleValidate = () => {
//     setIsReadonly(!isReadonly)
//   }

//   const handleDownload = () => {
//     if (!canvasRef.current) return

//     const canvas = canvasRef.current
//     const dataURL = canvas.toDataURL("image/png")
//     const a = document.createElement("a")
//     a.href = dataURL
//     a.download = "signature.png"
//     a.click()
//   }

//   // Initialize canvas on component mount
//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     canvas.width = canvas.offsetWidth
//     canvas.height = canvas.offsetHeight

//     const context = canvas.getContext("2d")
//     if (!context) return

//     context.strokeStyle = theme === "light" ? "black" : "white"
//     context.lineWidth = 2
//     context.lineCap = "round"
//     context.lineJoin = "round"

//     contextRef.current = context
//   }, [])

//   return (
//     <div className="flex flex-col gap-2">
//       <p className="text-sm tracking-tight text-neutral-500">Just sign here</p>
//       <canvas
//         ref={canvasRef}
//         className={cn(
//           "h-28 w-full rounded-lg border border-neutral-500/20 dark:bg-neutral-300/10 bg-neutral-500/10",
//           isReadonly ? "cursor-not-allowed" : "cursor-crosshair",
//           className,
//         )}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       />
//       <div className="flex justify-end gap-1 text-neutral-700 dark:text-neutral-200">
//         <Button
//           className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
//           onClick={handleValidate}
//           type="button"
//         >
//           {isReadonly ? (
//             <>
//               <RefreshCcwIcon className="size-5 dark:text-white text-black" />
//               <span className="sr-only">Reset</span>
//             </>
//           ) : (
//             <>
//               <CheckIcon className="size-5 dark:text-white text-black" />
//               <span className="sr-only">Validate</span>
//             </>
//           )}
//         </Button>
//         {isReadonly && isSigned && (
//           <Button
//             className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
//             onClick={handleDownload}
//             type="button"
//           >
//             <DownloadIcon className="size-5 dark:text-white text-black" />
//             <span className="sr-only">Download</span>
//           </Button>
//         )}
//         {!isReadonly && (
//           <Button
//             className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
//             onClick={handleClear}
//             type="button"
//           >
//             <Eraser className="size-5 dark:text-white text-black" />
//             <span className="sr-only">Clear</span>
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SignaturePad
