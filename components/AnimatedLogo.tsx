"use client"

import type React from "react"
import { motion } from "framer-motion"

const AnimatedLogo: React.FC = () => {
  // Define animation variants for different states
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 }, // Initial state: invisible and small
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }, // Animate to full size and opacity
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 }, // Slightly enlarge on hover
    },
  }

  return (
    <motion.div
      initial="hidden" // Start in the hidden state
      animate="visible" // Animate to the visible state
      whileHover="hover" // Apply hover effect
      variants={logoVariants} // Link to our animation variants
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: "#FFD700", // Gold background for a luxurious feel
        borderRadius: "50%", // Circular shape
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000", // Black text/icon color
        fontSize: "24px",
        fontWeight: "bold",
        cursor: "pointer", // Indicates interactivity
      }}
    >
      Your Logo
    </motion.div>
  )
}

export default AnimatedLogo

