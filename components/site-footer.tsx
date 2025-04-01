import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cross, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cross className="h-5 w-5" />
              <span className="font-bold text-lg">Faith Community</span>
            </div>
            <p className="text-primary-foreground/80 max-w-xs">
              Join our community of faith and discover spiritual growth through worship, fellowship, and service.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <nav className="grid gap-2">
              <Link
                href="/about"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/devotionals"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Devotionals
              </Link>
              <Link
                href="/events"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Events
              </Link>
              <Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Shop
              </Link>
              <Link
                href="/prayer-requests"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Prayer Requests
              </Link>
              <Link
                href="/contact"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Service Times</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div>
                <p className="font-medium">Sunday Services</p>
                <p>9:00 AM & 11:00 AM</p>
              </div>
              <div>
                <p className="font-medium">Wednesday Bible Study</p>
                <p>7:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Youth Group</p>
                <p>Fridays at 6:30 PM</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-primary-foreground/80 mb-4">
              Stay updated with our latest devotionals, events, and announcements.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-amber-400"
              />
              <Button className="w-full bg-white text-primary hover:bg-white/90">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/70 text-sm">
            &copy; {new Date().getFullYear()} Faith Community. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-primary-foreground/70">
            <Link href="/privacy-policy" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

