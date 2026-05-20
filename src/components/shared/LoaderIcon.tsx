import React from 'react'

export default function LoaderIcon() {
  return (
     <div className="min-h-screen bg-linear-to-br from-[#f1f4f1] to-white dark:bg-[#080808] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
         </div>
      </div>
  )
}
