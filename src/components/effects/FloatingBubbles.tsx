'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface Bubble {
  x: number; y: number
  vx: number; vy: number
  r: number
  alpha: number
  blurR: number   // soft-glow radius multiplier
  colorIdx: number
}

const COLORS = [
  [220, 38, 38],   // red-600
  [185, 28, 28],   // red-700
  [239, 68, 68],   // red-500
  [153, 27, 27],   // red-800
  [252, 165, 165], // red-300 — very faint highlight
]

const COUNT = 8
const REPEL_R  = 180   // px — mouse repulsion radius
const MAX_SPEED = 1.8
const MIN_SPEED = 0.12
const FRICTION  = 0.978

function rand(a: number, b: number) { return a + Math.random() * (b - a) }

function initBubbles(w: number, h: number): Bubble[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2 + rand(0, 0.5)
    return {
      x:        rand(w * 0.1, w * 0.9),
      y:        rand(h * 0.1, h * 0.9),
      vx:       Math.cos(angle) * rand(0.15, 0.35),
      vy:       Math.sin(angle) * rand(0.15, 0.35),
      r:        rand(25, 65),
      alpha:    rand(0.07, 0.16),
      blurR:    rand(1.8, 2.8),
      colorIdx: Math.floor(rand(0, COLORS.length)),
    }
  })
}

function drawBubble(ctx: CanvasRenderingContext2D, b: Bubble) {
  const [r, g, bl] = COLORS[b.colorIdx]
  const glowR = b.r * b.blurR

  // Outer soft glow
  const outer = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, glowR)
  outer.addColorStop(0,   `rgba(${r},${g},${bl},${(b.alpha * 0.7).toFixed(3)})`)
  outer.addColorStop(0.45,`rgba(${r},${g},${bl},${(b.alpha * 0.35).toFixed(3)})`)
  outer.addColorStop(1,   `rgba(${r},${g},${bl},0)`)
  ctx.beginPath()
  ctx.arc(b.x, b.y, glowR, 0, Math.PI * 2)
  ctx.fillStyle = outer
  ctx.fill()

  // Inner core — bright centre
  const inner = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
  inner.addColorStop(0,   `rgba(${r},${g},${bl},${Math.min(b.alpha * 1.4, 0.55).toFixed(3)})`)
  inner.addColorStop(0.5, `rgba(${r},${g},${bl},${(b.alpha * 0.7).toFixed(3)})`)
  inner.addColorStop(1,   `rgba(${r},${g},${bl},0)`)
  ctx.beginPath()
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
  ctx.fillStyle = inner
  ctx.fill()
}

export function FloatingBubbles() {
  const pathname  = usePathname()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -999, y: -999 })

  // Homepage stays completely untouched
  const active = pathname !== '/'

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth  || document.documentElement.clientWidth  || 1280
    let H = window.innerHeight || document.documentElement.clientHeight || 800
    canvas.width  = W
    canvas.height = H

    let bubbles = initBubbles(W, H)

    const onResize = () => {
      W = window.innerWidth  || document.documentElement.clientWidth  || 1280
      H = window.innerHeight || document.documentElement.clientHeight || 800
      canvas.width  = W
      canvas.height = H
      bubbles = initBubbles(W, H)
    }
    window.addEventListener('resize', onResize)

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf: number

    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      const { x: mx, y: my } = mouseRef.current

      for (const b of bubbles) {
        // Mouse repulsion
        const dx   = b.x - mx
        const dy   = b.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_R && dist > 1) {
          const strength = ((REPEL_R - dist) / REPEL_R) ** 1.4
          b.vx += (dx / dist) * strength * 0.9
          b.vy += (dy / dist) * strength * 0.9
        }

        // Speed cap
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
        if (spd > MAX_SPEED) {
          b.vx = (b.vx / spd) * MAX_SPEED
          b.vy = (b.vy / spd) * MAX_SPEED
        }

        // Friction
        b.vx *= FRICTION
        b.vy *= FRICTION

        // Minimum drift so bubbles never fully stop
        const spd2 = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
        if (spd2 < MIN_SPEED) {
          const a = Math.random() * Math.PI * 2
          b.vx += Math.cos(a) * 0.08
          b.vy += Math.sin(a) * 0.08
        }

        // Move
        b.x += b.vx
        b.y += b.vy

        // Wall bounce with some damping
        if (b.x < b.r)      { b.x = b.r;      b.vx =  Math.abs(b.vx) * 0.7 }
        if (b.x > W - b.r)  { b.x = W - b.r;  b.vx = -Math.abs(b.vx) * 0.7 }
        if (b.y < b.r)      { b.y = b.r;       b.vy =  Math.abs(b.vy) * 0.7 }
        if (b.y > H - b.r)  { b.y = H - b.r;  b.vy = -Math.abs(b.vy) * 0.7 }

        drawBubble(ctx, b)
      }

      raf = requestAnimationFrame(tick)
    }

    tick()

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100vw',
        height:        '100vh',
        zIndex:        1,
        pointerEvents: 'none',
      }}
    />
  )
}
