"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: "Find Peace and Purpose",
      description:
        "Join our community of faith and discover spiritual growth through worship, fellowship, and service.",
      cta: "Join Us",
      link: "/about",
    },
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: "Upcoming Retreat",
      description: "Experience renewal and restoration at our annual spiritual retreat in the mountains.",
      cta: "Register Now",
      link: "/events/retreat",
    },
    {
      image: "/placeholder.svg?height=1080&width=1920",
      title: "Daily Devotionals",
      description: "Start your day with inspiration and guidance from our daily devotional readings.",
      cta: "Read Today",
      link: "/devotionals",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentSlide === index ? 1 : 0,
            transition: { duration: 1 },
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: currentSlide === index ? 0 : 20,
                opacity: currentSlide === index ? 1 : 0,
              }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl max-w-2xl mb-8 text-white/90"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: currentSlide === index ? 0 : 20,
                opacity: currentSlide === index ? 1 : 0,
              }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {slide.description}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: currentSlide === index ? 0 : 20,
                opacity: currentSlide === index ? 1 : 0,
              }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white border border-primary/20">
                <Link href={slide.link}>{slide.cta}</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-100" : "bg-white/50 scale-75"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

