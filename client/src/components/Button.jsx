import React from 'react'

function Button({
    className = "",
    children,
    type = "button",
    ...props
}) {
  return (
    <button type={type} className={className} {...props}>{children}</button>
  )
}

export default Button
