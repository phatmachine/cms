'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Full-viewport film grain: a fixed canvas repainted every frame with sparse
 * 10%-alpha black pixels, held at low opacity above everything. The single
 * most characteristic element of the "paper" brand register — see
 * `Rethink The Machine - v2/readme.md`. Freezes to one frame under
 * prefers-reduced-motion instead of animating.
 */
export const GrainCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number | undefined
    const density = 0.5

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function paintNoise() {
      const idata = ctx!.createImageData(canvas!.width, canvas!.height)
      const buffer32 = new Uint32Array(idata.data.buffer)
      for (let i = 0; i < buffer32.length; i++) {
        if (Math.random() < density) buffer32[i] = 0x1a000000
      }
      ctx!.putImageData(idata, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      paintNoise()
    } else {
      const loop = () => {
        paintNoise()
        raf = requestAnimationFrame(loop)
      }
      loop()
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] opacity-[0.05]"
      ref={ref}
    />
  )
}
