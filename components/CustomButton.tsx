import React from 'react'
import { Button } from './ui/button'
export default function CustomButton({children,className,...props}:React.ComponentProps<typeof Button>) {
  return (
    <Button className={`rounded-none! py-6 px-10 text-lg font-['poppins'] ${className}`} {...props}>{children}</Button>
  )
}
