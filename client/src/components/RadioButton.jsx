import React from 'react'

function RadioButton({
    children,
    label,

    ...props
}) {
  return (
    <div>
      {children} 
      
      <input type = "radio" id={label} {...props} />
    </div>
  )
}

export default RadioButton

