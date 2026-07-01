'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// ─── Matrix Rain Canvas ───────────────────────────────────────────────────────

function MatrixRain({ dimmed }: { dimmed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const fontSize = 14
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF</>{}[];|'
    let cols = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(cols).fill(1)

    let animId: number

    const draw = () => {
      // Fading black trail
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Bright head character
        if (drops[i] * fontSize < fontSize * 3) {
          ctx.fillStyle = '#ff6666'
        } else {
          // Vary red intensity for depth
          const intensity = Math.floor(Math.random() * 155) + 100
          ctx.fillStyle = `rgb(${intensity},0,0)`
        }

        ctx.fillText(char, x, y)

        // Reset drop randomly after it passes viewport
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const resizeHandler = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / fontSize)
      drops.length = cols
      drops.fill(1)
    }
    window.removeEventListener('resize', resize)
    window.addEventListener('resize', resizeHandler)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        opacity: dimmed ? 0.04 : 0.18,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
      }}
    />
  )
}

// ─── Logo Watermark ───────────────────────────────────────────────────────────

function LogoWatermark({ dimmed }: { dimmed: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        width: dimmed ? 100 : 320,
        opacity: dimmed ? 0.06 : 0.18,
        transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <Image
        src="/logo-icon.webp"
        alt=""
        width={220}
        height={220}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        priority
      />
    </div>
  )
}

// ─── Composite export ─────────────────────────────────────────────────────────

export function MatrixBackground() {
  const [dimmed, setDimmed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setDimmed(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <MatrixRain dimmed={dimmed} />
      <LogoWatermark dimmed={dimmed} />
    </>
  )
}
