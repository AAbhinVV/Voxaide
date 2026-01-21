import React from 'react'
import { motion } from 'motion/react';

function Button({
    className = "",
    children,
    type = "button",
    ...props
}) {
  return (
    <motion.button type={type} className={className} {...props}>{children}</motion.button>
  )
}

export default Button
