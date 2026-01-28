import React, { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Button} from '../../components/exports.js'
import { Eye, EyeClosed } from 'lucide-react'
import {Tooltip} from '@heroui/tooltip'

function UserProfile() {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    

  return (
    <div className='overflow-hidden m-auto flex flex-col px-10 justify-center'>
        <div>
            <motion.span 
                initial = {{ opacity: 0, x: -20 }}
                animate = {{ opacity: 1, x: 0 }}
                transition = {{ delay: 0.3, duration: 0.4 }}
                className="text-5xl font-accent font-medium tracking-widest italic inline-block self-start">Abhinav's &nbsp;&nbsp;</motion.span>

            <motion.span 
                initial = {{ opacity: 0, x: -20 }}
                animate = {{ opacity: 1, x: 0 }}
                transition = {{ delay: 0.5, duration: 0.5 }}
                    className="text-5xl font-headings font-normal tracking-widest inline-block">Profile</motion.span>
        </div>
        <div className='flex flex-col items-center mt-12 w-full px-4 h-auto gap-10'>
            <div>
                <motion.img 
                    initial = {{ opacity: 0, y: 20 }}
                    animate = {{ opacity: 1, y: 0 }}
                    transition = {{ delay: 0.7, duration: 0.4 }}
                    src="https://avatars.githubusercontent.com/u/66286655?v=4" 
                    alt="Profile Picture" 
                    className='w-[65%] h-[65%] rounded-full object-cover border-4 border-blue-500 justify-self-center'/>
            </div>
            <motion.div
                initial = {{ opacity: 0, y: 20 }}
                animate = {{ opacity: 1, y: 0 }}
                transition = {{ delay: 0.9, duration: 0.5 }}
                className='flex flex-col w-fit gap-15 my-20 justify-center items-center'>
                <div className='flex flex-row w-full max-w-2xl items-center gap-20 justify-between'>
                    <label htmlFor={id} className='text-2xl font-body tracking-widest font-medium' >Display Name: </label>
                    <input type="text" id={id} className='text-center text-2xl px-3 py-2 bg-black/20 border-transparent transition delay-150 duration-300 ease-in-out hover:border-black/50 border-2 focus:border-danger outline-none rounded-lg' value="Abhianv" readOnly/>                
                </div>
                <div className='flex flex-row w-full max-w-2xl items-center gap-20 justify-between'>
                    <label htmlFor={id} className='text-2xl font-body tracking-widest font-medium justify-self-start' >Email: </label>
                    <input type="text" id={id} className='text-center text-2xl px-3 py-2 bg-black/20 border-transparent transition delay-150 duration-300 ease-in-out hover:border-black/50 border-2 focus:border-danger outline-none rounded-lg' value="Abhianv" readOnly/>                
                </div>
                <div className='flex flex-row w-full max-w-2xl items-center gap-20 justify-between'>
                    <label htmlFor={id} className='text-2xl font-body tracking-widest font-medium' >Password: </label>
                    <input type="text" id={id} className='-mr-45 text-center text-2xl px-3 py-2 bg-black/20 border-transparent transition delay-150 duration-300 ease-in-out hover:border-black/50 border-2 focus:border-danger outline-none rounded-lg' value={showPassword ? "Password" : "********" } readOnly />
                        <Tooltip content={showPassword ? "Show Password" : "Hide Password"}>
                            <Button onClick={togglePasswordVisibility} className='mix-blend-multiply mr-5'>{showPassword ? <EyeClosed /> : <Eye />}</Button>
                        </Tooltip>

                                    
                </div>
            </motion.div>

        </div>
      
    </div>
  )
}

export default UserProfile
