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

      <Card className="relative w-full max-w-md mx-4 shadow-2xl border border-gray-200 bg-white/80 backdrop-blur-sm animate-slide-up">
        <div className="flex justify-center -mt-14">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl border-4 border-white">
              <img src={Logo} alt="برنامج تعليم القرآن الكريم وتجويده Logo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-primary to-primary rounded-full"></div>
          </div>
        </div>
        
        <CardHeader className="text-center pb-2 pt-6">
          <CardTitle className="text-3xl font-display font-bold text-gray-900 tracking-wide">
            برنامج تعليم القرآن الكريم وتجويده
          </CardTitle>
          <p className="text-sm text-gray-600 font-body mt-1 font-medium">نظام التعلم الإلكتروني</p>
        </CardHeader>
        
        <CardContent className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-body font-medium text-gray-900">
                Registration Number
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. 1.5.1.A"
                className="font-body h-12 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-body font-medium text-gray-900">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="font-body h-12 bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all duration-300"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="relative w-full font-body font-semibold h-12 bg-primary hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
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
  );
};

export default LoginPage;