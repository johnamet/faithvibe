"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Heart, ShoppingBag, User } from "lucide-react"
import HeroSection from "@/components/hero-section"
import DevotionalPreview from "@/components/devotional-preview"
import FeaturedProducts from "@/components/featured-products"
import UpcomingEvents from "@/components/upcoming-events"
import DonationProgress from "@/components/donation-progress"

export default function Home() {
  const [loading, setLoading] = useState(true)

  // Simulate initial data fetch (could be moved to individual components)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Here you could prefetch data if needed, but we'll let components handle their own fetching
        setLoading(false)
      } catch (error) {
        console.error("Error loading homepage data:", error)
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Main Features Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">
              Welcome to Our Sanctuary
            </h2>
            <p className="text-muted-foreground max-w-[700px] mb-8">
              Join our community of faith and discover spiritual growth, fellowship, and purpose through our various
              ministries and resources.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
              <Link
                href="/devotionals"
                className="group flex flex-col items-center p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Devotionals</h3>
              </Link>
              <Link
                href="/shop"
                className="group flex flex-col items-center p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Shop</h3>
              </Link>
              <Link
                href="/events"
                className="group flex flex-col items-center p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Events</h3>
              </Link>
              <Link
                href="/account"
                className="group flex flex-col items-center p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Account</h3>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Devotional Preview */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Today's Devotional</h2>
            <Link
              href="/devotionals"
              className="group inline-flex items-center text-primary hover:text-primary/80 transition-colors mt-4 md:mt-0"
            >
              View All Devotionals
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <DevotionalPreview />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Featured Products</h2>
            <Link
              href="/shop"
              className="group inline-flex items-center text-primary hover:text-primary/80 transition-colors mt-4 md:mt-0"
            >
              Visit Shop
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">Upcoming Events</h2>
            <Link
              href="/events"
              className="group inline-flex items-center text-primary hover:text-primary/80 transition-colors mt-4 md:mt-0"
            >
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <UpcomingEvents />
        </div>
      </section>

      {/* Donation Progress */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-4">Support Our Ministry</h2>
            <p className="text-muted-foreground max-w-[700px] mb-8">
              Your generous contributions help us continue our mission and expand our reach to those in need.
            </p>
          </div>
          <DonationProgress />
          <div className="flex justify-center mt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Donate Now
            </Button>
          </div>
        </div>
      </section>

      {/* Prayer Request CTA */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Need Prayer?</h2>
              <p className="text-primary-foreground/90 max-w-[500px]">
                Our prayer team is committed to lifting your needs before God. Submit your prayer requests and we'll
                join you in faith.
              </p>
            </div>
            <div>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/prayer-requests">Submit Prayer Request</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}