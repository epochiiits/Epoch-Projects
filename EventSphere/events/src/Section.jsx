import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Card from './Card'

export default function Section({ title, items, color }) {
  // Decide direction for marquee
  const isLeftToRight = title.toLowerCase().includes('non-technical') // left to right
  const controls = useAnimation()

  // Starts the marquee from its current position; it goes continuously
  const startMarquee = () => {
    controls.start({
      x: isLeftToRight ? ['-50%', '0%'] : ['0%', '-50%'],
      transition: {
        repeat: Infinity,
        duration: 20,
        ease: 'linear',
      },
    })
  }

  // Begin marquee on mount
  useEffect(() => {
    startMarquee()
  }, [])

  return (
    <div className="mb-16">
      <h2
        className={`text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${color} text-center mb-8`}
      >
        {title}
      </h2>

      {/* Container with hidden overflow */}
      <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
        {/* Marquee + drag container */}
        <motion.div
          className="flex flex-nowrap gap-6 w-max"
          animate={controls}
          drag="x"
          dragConstraints={{ left: -3000, right: 0 }}
          onDragEnd={() => {
            // Resume continuous movement afterwards
            startMarquee()
          }}
        >
          {/* Original items */}
          {items.map((item, idx) => (
            <Card key={idx} {...item} />
          ))}

          {/* Duplicate items for seamless loop */}
          {items.map((item, idx) => (
            <Card key={`clone-${idx}`} {...item} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}