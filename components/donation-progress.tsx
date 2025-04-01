"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useAnimation } from "framer-motion"
import { getDonationProgress } from "@/services/donation-service" // Adjust path

export default function DonationProgress() {
  const [donationData, setDonationData] = useState({ current: 0, target: 25000, donors: 0, title: "", description: "" })
  const [loading, setLoading] = useState(true)
  const controls = useAnimation()

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getDonationProgress()
        setDonationData({
          current: data.current,
          target: data.goal,
          donors: data.donors || 0, // Optional field
          title: "Building Fund Campaign", // Hardcoded or fetch from Firebase
          description: "Help us reach our goal to expand our facilities and better serve our community.",
        })
      } catch (error) {
        console.error("Error fetching donation progress:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  const percentage = Math.round((donationData.current / donationData.target) * 100)

  useEffect(() => {
    if (!loading) {
      controls.start({
        width: `${percentage}%`,
        transition: { duration: 1.5, ease: "easeOut" },
      })
    }
  }, [percentage, controls, loading])

  if (loading) return <p>Loading donation progress...</p>

  return (
    <Card className="border-amber-100 overflow-hidden max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-primary mb-2">{donationData.title}</h3>
          <p className="text-muted-foreground">{donationData.description}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-3xl font-bold text-primary">${donationData.current.toLocaleString()}</span>
              <span className="text-muted-foreground"> raised of ${donationData.target.toLocaleString()}</span>
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
              <span className="font-medium text-primary">{donationData.donors}</span> Donors
            </div>
            <div>
              <span className="font-medium text-primary">
                ${(donationData.target - donationData.current).toLocaleString()}
              </span>{" "}
              to go
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}