import React, { useState } from 'react'
import { motion as Motion } from 'motion/react'
import { LoaderOne } from './ui/loader';

const LoadScreen = () => {
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setisLoading(true);
    setTimeout(() => {
      setisLoading(false);
      }, 3000);
  }, []);

  return (
    <div>
      <h1 className='text-blue-900'>VOXAIDE</h1>
      <LoaderOne />
    </div>
  )
}

export default LoadScreen
