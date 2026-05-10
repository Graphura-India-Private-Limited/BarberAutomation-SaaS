import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import barberImage from "../../assets/signup.png"; 


const ScissorIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ transform: 'rotate(180deg)' }}
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() !== "" && !emailRegex.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);
    if (value.length > 0 && value.length < 10) {
      setMobileError("Enter 10 digits");
    } else {
      setMobileError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setMobileError("10 digit number is required");
      return;
    }
    if (emailError) return;
    try {
    // This part sends the data to your backend
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        email: email,
        mobile : mobile,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Registration Successful!");
      // Send them to the login page you defined in App.jsx
      window.location.href = "/login"; 
    } else {
      // Show the error message your teammate wrote in authRoutes.js
      alert(data.message || "Registration failed. Try again.");
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Backend is not responding. Make sure your server is running on port 5000.");
  }
};

  return (
    <div className="h-screen w-full grid md:grid-cols-2 bg-[#FFFBF2] overflow-hidden font-sans text-[#3E362E]">
      
    
      <div
        className="hidden md:flex relative bg-cover bg-center"
        style={{ backgroundImage: `url(${barberImage})` }}
      >
 
        <div className="absolute inset-0 bg-[#3E362E]/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF2] via-transparent to-[#3E362E]/10"></div>
        
        {/* Logo Section */}
        <div className="absolute top-8 left-8 z-10 flex flex-col items-start">
          <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 text-[#3E362E] fill-[#C5A059] stroke-[#C5A059] stroke-[1px]" />
            Barber <span className="text-[#3E362E]">Pro</span>
          </h1>
          <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"></div>
          <p className="text-[14px] text-[#8D7B68] tracking-[0.3em] uppercase mt-2 text-center w-full font-black opacity-90">
  Est. 2026
</p>
        </div>

        {/* Floating Card */}
        <div className="absolute bottom-12 left-10 right-10 z-20">
          <div className="bg-[#FFFBF2]/70 backdrop-blur-xl border border-[#EAD8C0] p-8 rounded-3xl shadow-xl">
            <p className="uppercase tracking-[4px] text-[10px] text-[#C5A059] mb-2 font-bold">Join the Community</p>
            <h2 className="text-3xl font-extrabold text-[#3E362E] leading-tight uppercase tracking-tighter">
              Look Sharp. <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px #3E362E' }}>Feel Confident.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM SECTION */}
      <div className="relative flex items-center justify-center bg-[#FFFBF2] px-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-[120px]"></div>
        
        <div className="w-full max-w-md z-10">
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 p-3 rounded-3xl mb-3 shadow-sm">
                <ScissorIcon className="w-10 h-10 text-[#C5A059]" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-[#3E362E] tracking-tight">Sign Up</h2>
            <p className="text-[#C5A059] text-[10px] uppercase tracking-[4px] mt-2 opacity-80 font-bold">Start Your Journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[2px] text-[#8D7B68] font-bold ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name" 
                  className="w-full px-5 py-3 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] text-sm transition-all shadow-sm" 
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase tracking-[2px] text-[#8D7B68] font-bold">Email Address</label>
                  {emailError ? (
                    <span className="text-[9px] text-red-500 font-bold uppercase animate-pulse">{emailError}</span>
                  ) : (
                    <span className="text-[9px] text-[#C5A059]/60 font-bold uppercase italic">Optional</span>
                  )}
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className={`w-full px-5 py-3 bg-[#FDF5E6] border rounded-2xl text-[#3E362E] outline-none text-sm transition-all shadow-sm ${emailError ? "border-red-400" : "border-[#EAD8C0] focus:border-[#C5A059]"}`} 
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase tracking-[2px] text-[#8D7B68] font-bold">Mobile Number</label>
                  {mobileError && <span className="text-[9px] text-red-500 font-bold uppercase animate-pulse">{mobileError}</span>}
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A059] font-bold text-sm">+91</span>
                  <input 
                    type="tel" 
                    required
                    value={mobile}
                    maxLength="10"
                    onChange={handleMobileChange}
                    placeholder="XXXXX XXXXX" 
                    className={`w-full pl-14 pr-5 py-3 bg-[#FDF5E6] border rounded-2xl text-[#3E362E] outline-none text-sm transition-all shadow-sm ${mobileError ? "border-red-400" : "border-[#EAD8C0] focus:border-[#C5A059]"}`} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[2px] text-[#8D7B68] font-bold ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-5 py-3 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl text-[#3E362E] outline-none focus:border-[#C5A059] text-sm transition-all shadow-sm" 
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#3E362E] text-[#FFFBF2] py-4 rounded-2xl font-black tracking-[3px] uppercase text-xs shadow-lg transition-all mt-4 hover:bg-[#2A241F] hover:scale-[1.01] active:scale-[0.98]"
            >
              Create My Account
            </button>
          </form>

          <div className="mt-6 text-center border-t border-[#EAD8C0] pt-5">
            <p className="text-[#8D7B68] text-xs font-medium">
              Already have an account?{" "}
<Link to="/" className="text-[#C5A059] font-bold hover:underline underline-offset-4 ml-1">
  Sign In
</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;