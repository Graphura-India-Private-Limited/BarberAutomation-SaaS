
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AppContext";

export default function StaffLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      navigate("/owner/overview");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const demoLogin = (em, pw) => {
    const ok = login(em, pw);
    if (ok) navigate("/owner/overview");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white border-2 border-orange-200 rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-900 tracking-tight">The Royal Blade</h1>
          <p className="text-orange-600 text-sm mt-1">Staff Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-orange-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="you@salon.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-orange-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition">
            Login
          </button>
        </form>

        <div className="mt-6 border-t border-orange-100 pt-4">
          <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Demo Logins</p>
          <div className="space-y-2">
            <button onClick={() => demoLogin("ravi@salon.com", "owner123")}
              className="w-full text-left text-sm px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-gray-800 border border-orange-200">
              <strong>Owner</strong> — ravi@salon.com
            </button>
            <button onClick={() => demoLogin("ajay@salon.com", "barber123")}
              className="w-full text-left text-sm px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-gray-800 border border-orange-200">
              <strong>Ajay</strong> — Barber, Commission (sees finance)
            </button>
            <button onClick={() => demoLogin("kiran@salon.com", "kiran123")}
              className="w-full text-left text-sm px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-gray-800 border border-orange-200">
              <strong>Kiran</strong> — Barber, Fixed Salary (no finance)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}