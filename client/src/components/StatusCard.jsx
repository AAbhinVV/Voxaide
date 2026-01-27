import React from 'react'
import { cn } from '@heroui/theme'

function StatusCard({
    title = "",
    className = "",
    value = ""
}) {
  return (
    <div className ={cn(`flex flex-col gap-3 `, className)} >
      <p className = {`font-headings text-sm font-semibold self-start`}>{title}</p>
      <h1 className='text-2xl tracking-wide font-body  '>{value}</h1>
    </div>
  )
}

export default StatusCard
