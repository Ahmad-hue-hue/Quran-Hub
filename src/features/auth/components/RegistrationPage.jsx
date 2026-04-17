import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/assets/images/logo.jpeg";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { generateRgNumber, hashPassword } from "../utils/authUtils";

const RegistrationPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.gender) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    
    const hashedPassword = await hashPassword(formData.password);
    
    const rgNumber = generateRgNumber(1, formData.gender, 5);
    const marhala = 1;
    const awamu = 5;

    const studentData = {
      name: formData.name,
      rgNumber: rgNumber,
      phoneNumber: formData.phoneNumber,
      password: hashedPassword,
      marhala: marhala,
      awamu: awamu,
      gender: formData.gender,
      role: "student",
      createdAt: new Date().toISOString()
    };
    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(studentData);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(studentData));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success("Registration successful!");
    setRegistrationNumber(rgNumber);
    setIsLoading(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (registrationNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e5128\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
        </div>
        
        <div className="relative w-full max-w-md mx-4 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50">
          <Card className="relative bg-white/95 backdrop-blur-sm animate-slide-up rounded-[12px]">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-display font-bold text-gray-900">
                Registration Successful!
              </CardTitle>
              <p className="text-sm text-gray-700/70 font-body mt-2">
                You have successfully registered for Marhala One
              </p>
            </CardHeader>
            
            <CardContent className="px-10 pb-8 text-center space-y-6">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-sm text-gray-700 font-body mb-2">Your Registration Number</p>
                <p className="text-3xl font-display font-bold text-gray-800">{registrationNumber}</p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700/80">
                <p>Write this number down safely.</p>
                <p>You will use this number to login.</p>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-primary hover:bg-gray-800 text-white py-3 font-display font-semibold shadow-[0_10px_15px_-3px_rgba(5,150,105,0.3)] hover:shadow-[0_20px_25px_-5px_rgba(5,150,105,0.4)] transition-all duration-300 rounded-[12px]"
              >
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e5128\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>
      
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md mx-4 rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50">
        <Card className="relative bg-white/95 backdrop-blur-sm animate-slide-up rounded-[12px]">
          <div className="flex justify-center -mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(5,150,105,0.25)] border-4 border-white">
                <img src={Logo} alt="Tajweed Logo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          <CardHeader className="text-center pb-2 pt-4">
            <CardTitle className="text-2xl font-display font-bold text-gray-900 tracking-wide">
              Register
            </CardTitle>
            <p className="text-sm text-gray-700/70 font-body mt-1">Marhala One</p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="border-gray-200 focus:border-primary focus:ring-primary/20 rounded-[12px]"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+255..."
                  className="border-gray-200 focus:border-primary focus:ring-primary/20 rounded-[12px]"
                />
                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Password</label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="border-gray-200 focus:border-primary focus:ring-primary/20 rounded-[12px] pr-12"
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
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Confirm Password</label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="border-gray-200 focus:border-primary focus:ring-primary/20 rounded-[12px] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="A"
                      checked={formData.gender === "A"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.gender === "A" 
                        ? "border-primary bg-gray-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <span className="text-3xl font-bold text-blue-300">♂</span>
                      <p className="text-sm mt-2 font-semibold text-gray-800">Male</p>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="B"
                      checked={formData.gender === "B"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.gender === "B" 
                        ? "border-primary bg-gray-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <span className="text-3xl font-bold text-pink-300">♀</span>
                      <p className="text-sm mt-2 font-semibold text-gray-800">Female</p>
                    </div>
                  </label>
                </div>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-gray-800 text-white py-3 font-display font-semibold disabled:opacity-50 shadow-[0_10px_15px_-3px_rgba(5,150,105,0.3)] hover:shadow-[0_20px_25px_-5px_rgba(5,150,105,0.4)] transition-all duration-300 rounded-[12px]"
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;