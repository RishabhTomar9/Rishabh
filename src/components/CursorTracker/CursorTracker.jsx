import { useEffect, useRef } from 'react'

const GHOST_COUNT = 12
const LANGUAGES = [
  'HTML', 'CSS', 'JS', 'React', 'Node', 'SQL', 'MongoDB', 'Python', 'AWS', 'Git'
];


const CursorTracker = () => {
  const cursorDotRef = useRef(null)
  const ghostRefs = useRef(Array.from({ length: GHOST_COUNT }, () => ({ el: null, x: 0, y: 0 })))
  const ghostsInitializedRef = useRef(false)
  const particlesContainerRef = useRef(null)
  const lastSpawnTimeRef = useRef(0)

  useEffect(() => {
    const cursorDot = cursorDotRef.current
    const ghosts = ghostRefs.current

    if (!cursorDot) return

    const container = document.createElement('div')
    container.className = 'cursor-particles-container pointer-events-none fixed inset-0 z-[9999]'
    document.body.appendChild(container)
    particlesContainerRef.current = container

    let targetX = 0
    let targetY = 0
    let dotX = null
    let dotY = null
    let rafId

    const lerp = (start, end, t) => start + (end - start) * t

    const spawnParticle = (x, y) => {
      const now = performance.now()
      if (now - lastSpawnTimeRef.current < 50) return
      lastSpawnTimeRef.current = now

      const el = document.createElement('span')
      el.className = 'cursor-particle absolute text-xs font-bold opacity-0'
      el.textContent = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)]
      el.style.left = x + 'px'
      el.style.top = y + 'px'

      // Random tech colors
      const colors = ['#a855f7', '#3b82f6', '#eab308', '#ffffff']
      el.style.color = colors[Math.floor(Math.random() * colors.length)]

      // Animate manually via Web Animations API for better perf than adding/removing classes constantly
      const animation = el.animate([
        { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 1 },
        { transform: `translate(-50%, -100%) scale(1.2)`, opacity: 0 }
      ], {
        duration: 800,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      });

      animation.onfinish = () => el.remove();
      container.appendChild(el)
    }

    const moveCursor = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      if (dotX === null || dotY === null) {
        dotX = targetX
        dotY = targetY
      }
      spawnParticle(targetX, targetY)
    }

    const animate = () => {
      dotX = lerp(dotX, targetX, 0.1)
      dotY = lerp(dotY, targetY, 0.1)
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`

      // init ghosts
      if (!ghostsInitializedRef.current && targetX && targetY) {
        ghosts.forEach((g) => {
          g.x = targetX
          g.y = targetY
        })
        ghostsInitializedRef.current = true
      }

      // update ghosts
      ghosts.forEach((g, i) => {
        const el = g.el
        if (!el) return
        const t = 0.1 - i * 0.008
        g.x = lerp(g.x, targetX, Math.max(0.01, t))
        g.y = lerp(g.y, targetY, Math.max(0.01, t))
        el.style.transform = `translate(${g.x}px, ${g.y}px)`
      })

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', moveCursor)
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', moveCursor)
      if (particlesContainerRef.current) {
        particlesContainerRef.current.remove()
        particlesContainerRef.current = null
      }
    }
  }, [])

  return (
    <>
      <style>{`
        .cursor-dot {
          @apply fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-xl pointer-events-none z-[9999] mix-blend-difference;
          margin-left: -5px;
          margin-top: -5px;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        .cursor-ghost {
          @apply fixed top-0 left-0 w-8 h-8 border border-white/10 rounded-xl pointer-events-none z-[9998];
          margin-left: -16px;
          margin-top: -16px;
          transition: opacity 0.3s;
        }
      `}</style>

      {Array.from({ length: GHOST_COUNT }).map((_, i) => (
        <div
          key={i}
          className="cursor-ghost"
          ref={(el) => { ghostRefs.current[i].el = el }}
          style={{ opacity: 0.2 - i * 0.02, transform: 'scale(' + (1 - i * 0.05) + ')' }}
        />
      ))}
      <div ref={cursorDotRef} className="cursor-dot" />
    </>
  )
}

export default CursorTracker
