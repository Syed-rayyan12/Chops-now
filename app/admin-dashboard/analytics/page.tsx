"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const AnalyticsDashboard = dynamic(
  () => import('@/components/admin-panel-components/analytics-dashboard').then(m => ({ default: m.AnalyticsDashboard })),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-secondary"></div>
        <p className="mt-4 text-lg font-medium text-secondary">Loading analytics...</p>
      </div>
    </div>
  )}
)

const page = () => {
  return (
    <>
       <AnalyticsDashboard/>
    </>
  )
}

export default page
