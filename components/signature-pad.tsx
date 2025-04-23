"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { CheckIcon, DownloadIcon, Eraser, RefreshCcwIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface SignatureRef {
  clear: () => void
  svg: SVGSVGElement
}

interface SignatureProps {
  className?: string
  options?: {
    smoothing?: number
    streamline?: number
    thinning?: number
  }
  readonly?: boolean
  ref?: React.RefObject<SignatureRef>
}

export function SignaturePad({
  className,
  options = {
    smoothing: 0,
    streamline: 0.8,
    thinning: 0.7,
  },
  readonly = false,
}: SignatureProps) {
  const [isSigned, setIsSigned] = useState(false)
  const [isReadonly, setIsReadonly] = useState(readonly)
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

const {theme, setTheme} = useTheme()

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isReadonly) return

    const canvas = canvasRef.current
    if (!canvas) return

    isDrawing.current = true
    const rect = canvas.getBoundingClientRect()
    lastPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || !lastPoint.current || isReadonly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    contextRef.current.beginPath()
    contextRef.current.moveTo(lastPoint.current.x, lastPoint.current.y)
    contextRef.current.lineTo(currentPoint.x, currentPoint.y)
    contextRef.current.stroke()

    lastPoint.current = currentPoint
    setIsSigned(true)
  }

  const handleMouseUp = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isReadonly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]

    isDrawing.current = true
    lastPoint.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }

    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current || !lastPoint.current || isReadonly) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]

    const currentPoint = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }

    contextRef.current.beginPath()
    contextRef.current.moveTo(lastPoint.current.x, lastPoint.current.y)
    contextRef.current.lineTo(currentPoint.x, currentPoint.y)
    contextRef.current.stroke()

    lastPoint.current = currentPoint
    setIsSigned(true)

    e.preventDefault()
  }

  const handleTouchEnd = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const context = contextRef.current

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      setIsSigned(false)
      setIsReadonly(false)
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

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const context = canvas.getContext("2d")
    if (!context) return

    context.strokeStyle = theme === "light" ? "black" : "white"
    context.lineWidth = 2
    context.lineCap = "round"
    context.lineJoin = "round"

    contextRef.current = context
  }, [])

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
      <div className="flex justify-end gap-1 text-red-700 dark:text-neutral-200">
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
