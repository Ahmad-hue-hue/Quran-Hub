import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/assets/images/logo.jpeg";
import { useNavigate, Link } from "react-router-dom";
import { hashPassword } from "../utils/authUtils";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const username = formData.username.trim();
    const password = formData.password;

    if (username === "Admin" && password === "/") {
      localStorage.setItem("currentUser", JSON.stringify({
        name: "Administrator",
        role: "admin",
        username: "Admin"
      }));
      toast.success("Login successful!");
      navigate("/admin");
      return;
    }

    const hashedPassword = await hashPassword(password);
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    const user = users.find(u => u.rgNumber === username && u.password === hashedPassword);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success("Login successful!");
      if (user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
      return;
    }

    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    const teacher = teachers.find(t => (t.username === username || t.phone === username) && t.password === hashedPassword);
    
    if (teacher) {
      localStorage.setItem("currentUser", JSON.stringify(teacher));
      toast.success("Login successful!");
      navigate("/teacher");
      return;
    }

    setError("Invalid registration number or password");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23111827\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>
      
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md mx-4 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50">
        <Card className="relative bg-white/95 backdrop-blur-sm animate-slide-up rounded-[12px]">
          <div className="flex justify-center -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(5,150,105,0.25)] border-4 border-white">
                <img src={Logo} alt="برنامج تعليم القرآن الكريم وتجويده Logo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          <CardHeader className="text-center pb-2 pt-4">
            <CardTitle className="text-3xl font-display font-bold text-gray-900 tracking-wide">
              برنامج تعليم القرآن الكريم وتجويده
            </CardTitle>
            <p className="text-sm text-gray-600 font-body mt-1 font-medium">نظام التعلم الإلكتروني</p>
          </CardHeader>
          
          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-body font-medium text-gray-500">
                  Registration Number
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. 1.5.1.A"
                  className="font-body h-12 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 rounded-[12px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-body font-medium text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="font-body h-12 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300 rounded-[12px] pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                className="relative w-full font-body font-semibold h-12 bg-primary hover:bg-gray-800 text-white shadow-[0_10px_15px_-3px_rgba(5,150,105,0.3)] hover:shadow-[0_20px_25px_-5px_rgba(5,150,105,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 rounded-[12px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 font-body">
                New here?{" "}
                <Link to="/register" className="font-semibold text-primary hover:text-gray-700 transition-colors duration-200 underline decoration-primary/30 underline-offset-4">
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;