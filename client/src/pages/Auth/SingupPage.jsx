import { useState } from "react";
import { Button, Input } from "../../components/exports";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../config/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function SingupPage() {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: { errors }, setError} = useForm({resolver: zodResolver(loginSchema) });
    

    

    const login = async (data) => {
        setError("");
        try{
            navigate("/login");
        }catch(error){
            setError(error.message);
        }
    }
    
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center bg-bg-page relative">
      {/* Animated decorative blurred circles with bounce effect */}
      <motion.div
        className="absolute w-72 h-72 bg-brand-primary/50 rounded-full blur-3xl"
        animate={{
          x: [0, 600, 0, 500, 100, 700, 0],
          y: [0, 400, 600, 200, 500, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.15, 0.3, 0.5, 0.65, 0.85, 1],
        }}
        style={{ top: "0%", left: "0%" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-brand-accent/50 rounded-full blur-3xl"
        animate={{
          x: [0, -500, 0, -400, 0, -600, 0],
          y: [0, -300, 0, -500, 0, -200, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1],
        }}
        style={{ bottom: "0%", right: "0%" }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-purple-500/50 rounded-full blur-3xl"
        animate={{
          x: [0, 800, 200, 700, 0, 600, 0],
          y: [0, -400, 0, -300, 0, -500, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.18, 0.35, 0.52, 0.7, 0.85, 1],
        }}
        style={{ bottom: "10%", left: "0%" }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-pink-500/35 rounded-full blur-3xl"
        animate={{
          x: [0, -600, 0, -500, 0, -700, 0],
          y: [0, 500, 0, 400, 0, 600, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.16, 0.32, 0.48, 0.64, 0.82, 1],
        }}
        style={{ top: "0%", right: "0%" }}
      />
      <motion.div
        className="absolute w-56 h-56 bg-cyan-400/30 rounded-full blur-3xl"
        animate={{
          x: [0, -400, 200, -300, 400, -200, 0],
          y: [0, -500, 0, -400, 0, -600, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.17, 0.34, 0.5, 0.67, 0.84, 1],
        }}
        style={{ bottom: "0%", left: "40%" }}
      />
      <motion.div
        className="absolute w-60 h-60 bg-indigo-500/35 rounded-full blur-3xl"
        animate={{
          x: [0, -700, 0, -500, 0, -600, 0],
          y: [0, 300, 600, 100, 500, 200, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.15, 0.32, 0.48, 0.65, 0.82, 1],
        }}
        style={{ top: "30%", right: "0%" }}
      />

        <div className=" inline-block z-10">
            <h1 className="font-headings text-[64px] font-bold">Join Voxaide</h1>
            <h3 className="pl-[10px] text-lg text-text-secondary">Start Recording</h3>
        </div>

            <div className="border border-white/20 h-auto w-auto px-20 shadow-xl font-body rounded-2xl backdrop-blur-lg z-10 my-10 relative">
            <div className="absolute -inset-2 rounded-lg bg-linear-to-br from-white via-brand-accent to-white opacity-20 blur-sm"></div>
                <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4 p-10 relative ">
                    <Input 
                    label="Email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className="border-2 focus:border-brand-primary outline-none rounded-lg"
                    {...register("email")}
                    />
                    {errors.email && <p className="text-danger mt-8 text-center">{errors.email.message}</p> }

                    <Input 
                    label="Username" 
                    type="text" 
                    placeholder="Enter your username" 
                    className="border-2 focus:border-brand-primary outline-none rounded-lg"
                    {...register("username")}
                    />
                    {errors.username && <p className="text-danger mt-8 text-center">{errors.username.message}</p> }

                    <Input 
                    label="Password" 
                    type="password" 
                    placeholder="Enter your password" 
                    className="border-2 focus:border-brand-primary outline-none rounded-lg"
                    {...register("password")}
                    />
                    {errors.password && <p className="text-danger mt-8 text-center">{errors.password.message}</p> }


                    <Button className="bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-secondary transition duration-200 hover:brightness-200 hover:scale-105 active:scale-98">Login</Button>
                </form>
            </div>
            <div className="z-10">
                <h2>Already have an account? <a href="/login" className="text-brand-primary hover:text-brand-secondary">Login</a></h2>
            </div>
    </div>
  )
}

export default LoginPage
