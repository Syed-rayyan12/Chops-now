"use client"

// Shares a single search query between a dashboard's persistent header (where the
// search box lives) and the page content that filters on it (orders, menu, etc).
// Each dashboard layout mounts its own provider, so the restaurant and rider
// dashboards keep independent query state. Consuming outside a provider is safe
// (no-op setter, empty query) so components don't crash if rendered standalone.
import { createContext, useContext, useState, type ReactNode } from "react"

interface DashboardSearch {
  query: string
  setQuery: (q: string) => void
}

const DashboardSearchContext = createContext<DashboardSearch>({
  query: "",
  setQuery: () => {},
})

export function DashboardSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("")
  return (
    <DashboardSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </DashboardSearchContext.Provider>
  )
}

export function useDashboardSearch() {
  return useContext(DashboardSearchContext)
}
