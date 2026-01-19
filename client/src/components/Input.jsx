import React, { useId } from 'react'

function Input({
    type = "text",
    className = "",
    label = "",
    ...props
}) {
    const id = useId();

  return (
    <div className='w-full flex flex-col'>
        {label && <label htmlFor={id} className='font-body text-text-primary text-md inline-block my-1 px-1'>{label}</label>}
        <input type={type} id={id} className={`px-3 py-2 bg-transparent border-transparent transition delay-150 duration-300 ease-in-out hover:border-black/50 ${className}`} {...props} />
    </div>
  )
}

export default Input
