import React from 'react'

export default function Button({children,className,...props}:any) {
  return (
    <button {...props} className={`bg-indigo-600 max-md:text-xs hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2 ${className}`}>{children}</button>
  )
}
