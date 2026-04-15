import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/assets/images/logo.jpeg";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/toast";
import { generateRgNumber, hashPassword } from "../utils/authUtils";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
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
    toast("Registration successful!", "success");
    setRegistrationNumber(rgNumber);
    setIsLoading(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (registrationNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e5128\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
        </div>
        
        <Card className="relative w-full max-w-md mx-4 shadow-2xl border border-emerald-100/50 bg-white/80 backdrop-blur-sm animate-slide-up">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-display font-bold text-emerald-900">
              Registration Successful!
            </CardTitle>
            <p className="text-sm text-emerald-700/70 font-body mt-2">
              You have successfully registered for Marhala One
            </p>
          </CardHeader>
          
          <CardContent className="px-10 pb-8 text-center space-y-6">
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
              <p className="text-sm text-emerald-700 font-body mb-2">Your Registration Number</p>
              <p className="text-3xl font-display font-bold text-emerald-800">{registrationNumber}</p>
            </div>
            
            <div className="space-y-2 text-sm text-emerald-700/80">
              <p>Write this number down safely.</p>
              <p>You will use this number to login.</p>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-display font-semibold"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 relative overflow-hidden">
      {/* Subtle organic pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e5128\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")' }}>
      </div>
      
      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <Card className="relative w-full max-w-md mx-4 shadow-2xl border border-emerald-100/50 bg-white/80 backdrop-blur-sm animate-slide-up">
        {/* Logo Container */}
        <div className="flex justify-center -mt-14">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl border-4 border-white">
              <img src={Logo} alt="Tajweed Logo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full"></div>
          </div>
        </div>
        
        <CardHeader className="text-center pb-2 pt-6">
          <CardTitle className="text-2xl font-display font-bold text-emerald-900 tracking-wide">
            Register
          </CardTitle>
          <p className="text-sm text-emerald-700/70 font-body mt-1">Marhala One</p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-800">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-800">Phone Number</label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+255..."
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100"
              />
              {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-800">Password</label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-800">Confirm Password</label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-100"
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-800">Gender</label>
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
                      ? "border-emerald-500 bg-emerald-50" 
                      : "border-gray-200 hover:border-emerald-300"
                  }`}>
                    <span className="text-lg">👨</span>
                    <p className="text-sm mt-1 font-medium text-emerald-800">Male</p>
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
                      ? "border-emerald-500 bg-emerald-50" 
                      : "border-gray-200 hover:border-emerald-300"
                  }`}>
                    <span className="text-lg">👩</span>
                    <p className="text-sm mt-1 font-medium text-emerald-800">Female</p>
                  </div>
                </label>
              </div>
              {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-display font-semibold disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-emerald-700">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPage;
