import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'
import Navbar from './Navbar'
import Spores from './Spores'
import SplitText from './SplitText' // Import the new component

const Hero = () => {
  const heroRef = useRef(null)
  const revealRef = useRef(null)
  const audioRef = useRef(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUpsideDown, setIsUpsideDown] = useState(false)

  // Audio Toggle
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.error("Audio error:", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Mode Toggle
  const handleEnterUpsideDown = () => {
    setIsUpsideDown(prev => !prev)
    // Auto-play audio on entry
    if (!isPlaying && !isUpsideDown) toggleAudio()
  }

  // --- MOUSE & FLASHLIGHT LOGIC ---
  useEffect(() => {
    const hero = heroRef.current
    const reveal = revealRef.current
    let animationFrameId;
    
    // Mouse coordinates
    let mouse = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }

    // Smooth movement loop
    const animate = () => {
      // Linear interpolation for smoothness (0.1 = speed)
      current.x += (mouse.x - current.x) * 0.1
      current.y += (mouse.y - current.y) * 0.1

      if (reveal) {
        reveal.style.setProperty('--x', `${current.x}px`)
        reveal.style.setProperty('--y', `${current.y}px`)
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    const handleMouseMove = (e) => {
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top

      // Show flashlight if we are moving mouse inside hero
      if (reveal && !reveal.classList.contains('active')) {
        reveal.classList.add('active')
      }
    }

    const handleMouseLeave = () => {
      // Hide flashlight when leaving the div
      if (reveal) reveal.classList.remove('active')
    }

    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove)
      hero.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove)
        hero.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [isUpsideDown]) // Re-bind if mode changes to ensure clean state

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className={`hero ${isUpsideDown ? 'upside-down-mode' : ''}`} ref={heroRef}>
      
      <audio ref={audioRef} loop>
        <source src={`${import.meta.env.BASE_URL}audio/theme.mp3`} type="audio/mp3" />
      </audio>

      {/* Spores Layer */}
      {isUpsideDown && <Spores />}

      <Navbar />

      <motion.div 
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div className="left" variants={itemVariant}>
          {/* Title with SplitText for character rotation */}
          <h1>
            <SplitText active={isUpsideDown}>STRANGER</SplitText>
            <br />
            <SplitText active={isUpsideDown}>THINGS</SplitText>
          </h1>

          <p>
            <SplitText active={isUpsideDown}>
              When the lights begin to flicker and reality bends,
              a hidden world awakens beneath Hawkins.
            </SplitText>
          </p>

          <motion.button 
            onClick={handleEnterUpsideDown}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SplitText active={isUpsideDown}>
              {isUpsideDown ? "LEAVE THE UPSIDE DOWN" : "ENTER THE UPSIDE DOWN"}
            </SplitText>
          </motion.button>
        </motion.div>

        <motion.div className="right" variants={itemVariant}>
          <h1>
            <SplitText active={isUpsideDown}>The Mind Flayer</SplitText>
          </h1>
          <p>
            <SplitText active={isUpsideDown}>
              Shadows creep from another dimension.
            </SplitText>
          </p>
          <p>
            <SplitText active={isUpsideDown}>
              Will you survive the terror?
            </SplitText>
          </p>
        </motion.div>
      </motion.div>

      {/* Flashlight / Monster Reveal Layer */}
      {/* If UpsideDown: 'active-permanent' makes it fully visible.
          Otherwise: CSS hover logic + JS mouse tracking handles the flashlight. */}
      <div 
        className={`fire-reveal ${isUpsideDown ? 'active-permanent' : ''}`} 
        ref={revealRef}
      ></div>

      <div className="audio-controls" onClick={toggleAudio}>
        {isPlaying ? "STOP MUSIC" : "PLAY MUSIC"}
      </div>
    </div>
  )
}

export default Hero