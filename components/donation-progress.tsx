"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useAnimation } from "framer-motion"

// This would be fetched from Firebase in a real implementation
const donationGoal = {
  current: 15750,
  target: 25000,
  donors: 124,
  title: "Building Fund Campaign",
  description: "Help us reach our goal to expand our facilities and better serve our community.",
}

export default function DonationProgress() {
  const [progress, setProgress] = useState(0)
  const controls = useAnimation()

  const percentage = Math.round((donationGoal.current / donationGoal.target) * 100)

  useEffect(() => {
    controls.start({
      width: `${percentage}%`,
      transition: { duration: 1.5, ease: "easeOut" },
    })

    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 500)

    return () => clearTimeout(timer)
  }, [percentage, controls])

  return (
    <Card className="border-amber-100 overflow-hidden max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-primary mb-2">{donationGoal.title}</h3>
          <p className="text-muted-foreground">{donationGoal.description}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-bold text-primary">${donationGoal.current.toLocaleString()}</span>
              <span className="text-muted-foreground"> raised of ${donationGoal.target.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-medium">{percentage}%</span>
            </div>
          </div>

          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={controls}
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-primary">{donationGoal.donors}</span> Donors
            </div>
            <div>
              <span className="font-medium text-primary">${donationGoal.target - donationGoal.current}</span> to go
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

