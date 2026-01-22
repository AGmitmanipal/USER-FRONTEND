import React, { useState } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { googleProvider } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. If you signed up with Google, please use that.");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 sm:p-8 md:p-10 lg:p-12 space-y-6 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/20 dark:bg-gray-900/40 border border-white/30">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-lg">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-5">

          <div>
            <label htmlFor="email" className="block mb-1 text-sm sm:text-base font-medium text-white/90">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-300 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 backdrop-blur-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm sm:text-base font-medium text-white/90">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-300 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 backdrop-blur-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>


          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm sm:text-base font-medium text-white/90">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-300 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 backdrop-blur-md"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition duration-200 ease-in-out transform rounded-lg bg-linear-to-r from-pink-500 to-indigo-500 hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 hover:scale-[1.02]"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>

          <div className="relative flex items-center justify-center w-full mt-6 border-t border-white/20 pt-6">
            <div className="absolute px-3 bg-transparent text-white/60 text-xs sm:text-sm">
              OR
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2 sm:py-3 mt-6 text-sm sm:text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 transition duration-200 ease-in-out transform rounded-lg focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="flex items-center justify-center">
          <p className="text-xs sm:text-sm text-white/80">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="font-semibold underline decoration-pink-400 decoration-2 underline-offset-2 hover:text-pink-300 transition"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>

        {error && (
          <p className="mt-3 text-xs sm:text-sm text-center text-red-300 bg-red-500/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

