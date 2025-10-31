"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const searchSuggestions = [
  "Pizza",
  "Burger",
  "Sushi",
  "Chinese",
  "Italian",
  "Indian",
  "Thai",
  "Mexican",
  "Pasta",
  "Tacos",
  "Ramen",
  "Curry",
  "Pad Thai",
  "Biryani",
  "Falafel",
  "Hummus",
]

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value.length > 0) {
      const filtered = searchSuggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion.toLowerCase() !== value.toLowerCase(),
      )
      setFilteredSuggestions(filtered.slice(0, 6))
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [value])

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    onChange("")
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length > 0 && setShowSuggestions(filteredSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-10 w-full h-12 text-lg bg-white rounded-lg border border-primary/50"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-primary text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-primary/50 rounded-md shadow-lg z-50">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-primary/50 last:border-b-0 cursor-pointer"
            >
              <div className="flex items-center">
                <Search className="w-4 h-4 text-muted-foreground mr-3" />
                <span className="text-foreground">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
