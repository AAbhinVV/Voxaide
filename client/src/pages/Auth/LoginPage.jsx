import {Button, Input} from "../../components/exports";

function LoginPage() {
    

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center bg-bg-page">
        <div className="mb-10 inline-block">
            <h1 className="font-headings text-6xl font-bold">Welcome Back</h1>
            <h3 className="text-lg text-text-secondary">Continue Recording</h3>
        </div>

            <div className='bg-pink-600 py-10 px-7 rounded-2xl transition duration-300 ease-in-out'>
                <div className="border border-transparent h-auto w-auto px-20 shadow-xl font-body rounded-2xl backdrop-blur-md">
                    <form className="flex flex-col gap-4 p-10">
                        <Input label="Email" type="email" placeholder="Enter your email" className="border-2 focus:border-brand-primary outline-none rounded-lg"/>
                        <Input label="Password" type="password" placeholder="Enter your password" className="border-2 focus:border-brand-primary outline-none rounded-lg"/>
                        <Button className="bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-secondary transition duration-200 hover:brightness-200 hover:scale-110">Login</Button>
                    </form>
                </div>
            </div>
            <div>
                <h2>Don't have an account? <a href="/register" className="text-brand-primary hover:text-brand-secondary">Register</a></h2>
            </div>
    </div>
  )
}

export default LoginPage
