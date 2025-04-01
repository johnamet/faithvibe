"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  presetColors?: string[]
}

export function ColorPicker({ label, value, onChange, presetColors = [] }: ColorPickerProps) {
  const [color, setColor] = useState(value)
  const [isOpen, setIsOpen] = useState(false)

  // Default preset colors if none provided
  const defaultPresets =
    presetColors.length > 0
      ? presetColors
      : [
          "#f59e0b", // amber-500
          "#ef4444", // red-500
          "#3b82f6", // blue-500
          "#10b981", // emerald-500
          "#8b5cf6", // violet-500
          "#ec4899", // pink-500
          "#f97316", // orange-500
          "#14b8a6", // teal-500
          "#6366f1", // indigo-500
          "#000000", // black
          "#ffffff", // white
        ]

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  const handleApply = () => {
    onChange(color)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setColor(value)
    setIsOpen(false)
  }

  const handlePresetClick = (presetColor: string) => {
    setColor(presetColor)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}>{label}</Label>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-0 border-2" style={{ backgroundColor: color }}>
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Pick a color</h4>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleApply}>
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Apply</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              </div>

              <Input
                id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
                type="color"
                value={color}
                onChange={handleChange}
                className="w-full h-8"
              />

              <div>
                <Label className="text-xs">Presets</Label>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {defaultPresets.map((presetColor) => (
                    <Button
                      key={presetColor}
                      variant="outline"
                      className="w-8 h-8 p-0 rounded-md border"
                      style={{ backgroundColor: presetColor }}
                      onClick={() => handlePresetClick(presetColor)}
                    >
                      {color === presetColor && (
                        <Check className="h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                      )}
                      <span className="sr-only">Select color {presetColor}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input value={color} onChange={handleChange} className="font-mono" onBlur={() => onChange(color)} />
      </div>
    </div>
  )
}

