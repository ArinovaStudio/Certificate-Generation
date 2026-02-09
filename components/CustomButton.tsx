import React from 'react'
import { Button } from './ui/button'
export default function CustomButton({children,className,...props}:React.ComponentProps<typeof Button>) {
  return (
    <Button className={`rounded-none! py-3! px-4! text-lg! font-['poppins'] ${className}`} {...props}>{children}</Button>
  )
}
