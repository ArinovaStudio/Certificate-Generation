import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
interface Props{
    link: string;
    text: string;
}
export default function ListItem({link,text}:Props) {
  return (
    <Link href={link}>
    <Button variant={"ghost"}>{text}</Button>
    </Link>
  )
}
