import React from 'react'
import { motion } from 'motion/react';

function Button({
    className = "",
    children,
    type = "submit",
    onHover,
    ...props
}) {
  return (
    <motion.button type={type} className={className} {...props} whileHover={onHover}>{children}</motion.button>
  )
}

export default Button
