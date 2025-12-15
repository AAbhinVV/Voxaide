import { useState, useEffect } from "react";
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function VoxaideAuth() {

    //routing
    const [searchParams, setSearhcParasms] = useSearchParams();
    const isLogin = searchParams.get("mode") !== "register";



    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: ""
    });
    const [errors, setErrors] = useState({});

    // Add CSS animation for bubbles
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
        @keyframes float-up {
            0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
            }
            10% {
            opacity: 0.5;
            }
            50% {
            transform: translateY(-50vh) translateX(${Math.random() * 40 - 20}px) scale(1.1);
            opacity: 0.5;
            }
            90% {
            opacity: 0.3;
            }
            100% {
            transform: translateY(-100vh) translateX(${Math.random() * 60 - 30}px) scale(0.9);
            opacity: 0;
            }
        }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateLogin = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        return newErrors;
    };

    const validateRegister = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) newErrors.phone = "Phone number is invalid";
        return newErrors;
    };

    const handleLogin = () => {
        const newErrors = validateLogin();
        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }
        alert(`Login successful!\nEmail: ${formData.email}`);
        setFormData({ username: "", email: "", password: "", phone: "" });
    };

    const handleRegister = () => {
        const newErrors = validateRegister();
        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }
        alert(`Registration successful!\nRedirecting to login...`);
        setFormData({ username: "", email: "", password: "", phone: "" });
        setErrors({});
        setIsLogin(true);
    };

    const switchToRegister = () => {
        setIsLogin(false);
        setFormData({ username: "", email: "", password: "", phone: "" });
        setErrors({});
    };

    const switchToLogin = () => {
        setIsLogin(true);
        setFormData({ username: "", email: "", password: "", phone: "" });
        setErrors({});
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
        }
    };

    // Generate random bubbles
    const bubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 20, // 20-80px
        left: Math.random() * 100, // 0-100%
        animationDuration: Math.random() * 15 + 10, // 10-25s
        animationDelay: Math.random() * 5, // 0-5s
        opacity: Math.random() * 0.3 + 0.2 // 0.2-0.5
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Animated Bubbles */}
        {bubbles.map((bubble) => (
            <div
            key={bubble.id}
            className="fixed rounded-full pointer-events-none"
            style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                bottom: '-100px',
                background: `radial-gradient(circle at 30% 30%, rgba(71, 85, 105, ${bubble.opacity}), rgba(51, 65, 85, ${bubble.opacity * 0.7}))`,
                animation: `float-up ${bubble.animationDuration}s ease-in-out ${bubble.animationDelay}s infinite`,
                boxShadow: `0 0 20px rgba(71, 85, 105, ${bubble.opacity * 0.3})`
            }}
            />
        ))}
        
        <div className="w-full max-w-md relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
            <div className="relative inline-block">
                <div className="text-5xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700">
                VOXAIDE
                </div>
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-slate-400/15 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-500/15 rounded-full blur-2xl" />
            </div>
            <p className="text-slate-600 mt-4 font-light">
                {isLogin ? "Welcome back" : "Create your account"}
            </p>
            </div>

            {/* Auth Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200/50">
            <div className="mb-6">
                <h2 className="text-2xl font-light text-slate-800">
                {isLogin ? "Sign In" : "Sign Up"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                {isLogin ? "Enter your credentials to continue" : "Fill in your details to get started"}
                </p>
            </div>

            <div className="space-y-5">
                {/* Username - Register Only */}
                {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                    </label>
                    <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.username ? 'border-red-400' : 'border-slate-200'
                        } focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all`}
                        placeholder="johndoe"
                    />
                    </div>
                    {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                    )}
                </div>
                )}

                {/* Email */}
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.email ? 'border-red-400' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all`}
                    placeholder="you@example.com"
                    />
                </div>
                {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                </div>

                {/* Password */}
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.password ? 'border-red-400' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all`}
                    placeholder="••••••••"
                    />
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                </div>

                {/* Phone - Register Only */}
                {!isLogin && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                    </label>
                    <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border ${
                        errors.phone ? 'border-red-400' : 'border-slate-200'
                        } focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all`}
                        placeholder="+1 (555) 123-4567"
                    />
                    </div>
                    {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                </div>
                )}

                {/* Forgot Password - Login Only */}
                {isLogin && (
                <div className="flex justify-end">
                    <button
                    type="button"
                    className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                    Forgot password?
                    </button>
                </div>
                )}

                {/* Submit Button */}
                <button
                onClick={isLogin ? handleLogin : handleRegister}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                    onClick={isLogin ? switchToRegister : switchToLogin}
                    className="text-slate-700 font-medium hover:text-slate-900 transition-colors inline-flex items-center gap-1"
                >
                    {isLogin ? "Sign Up" : "Sign In"}
                    {!isLogin && <ArrowLeft className="w-4 h-4" />}
                    {isLogin && <ArrowRight className="w-4 h-4" />}
                </button>
                </p>
            </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
            <p className="text-xs text-slate-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
            </div>
        </div>
        </div>
    );
}