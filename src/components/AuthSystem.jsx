import React, { useState, useEffect } from "react";
import { User, Phone, Home, Lock, Mail } from "lucide-react";
import { createContext, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      const response = await fetch(
        "https://mahaspice.desoftimp.com/ms3/login/get-user-details.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: userData.phone }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      if (data.success) {
        // Update local storage and state with fresh data
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        throw new Error(data.error || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      // Handle error - you might want to logout the user if refresh fails
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []); // Run on mount

  useEffect(() => {
    // Check for existing user session on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const updateUser = (newData) => {
    setUser(newData);
    localStorage.setItem("user", JSON.stringify(newData));
    refreshUserData(); // Refresh data from server after update
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshUserData, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const AuthSystem = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    otp: "",
  });

  const API_BASE_URL = "https://mahaspice.desoftimp.com/ms3/login";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkUserExists = async (phone) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone", phone);

      const response = await fetch(`${API_BASE_URL}/check-user.php`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking user:", error);
      throw new Error("Unable to check user status");
    }
  };

  const sendOTP = async (phone) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone", phone);

      const response = await fetch(`${API_BASE_URL}/send-otp.php`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setShowOTP(true);
        return true;
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Unable to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate email if signing up
      if (!isLogin && !validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      // First check if user exists
      const userExists = await checkUserExists(formData.phone);

      if (userExists && !isLogin) {
        setError("Account already exists. Please login instead.");
        setIsLogin(true);
        return;
      }

      if (!userExists && isLogin) {
        setError("Account not found. Please sign up first.");
        setIsLogin(false);
        return;
      }

      // If we get here, we're in the correct flow
      await sendOTP(formData.phone);
      setShowOTP(true);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("otp", formData.otp);

      // Verify OTP
      const response = await fetch(`${API_BASE_URL}/verify-otp.php`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        if (!isLogin) {
          // Handle signup after OTP verification
          const signupFormData = new FormData();
          signupFormData.append("name", formData.name);
          signupFormData.append("email", formData.email);
          signupFormData.append("phone", formData.phone);
          signupFormData.append("address", formData.address);

          const signupResponse = await fetch(`${API_BASE_URL}/signup.php`, {
            method: "POST",
            body: signupFormData,
          });

          if (!signupResponse.ok) {
            const errorData = await signupResponse.json();
            throw new Error(
              errorData.error || `HTTP error! status: ${signupResponse.status}`
            );
          }

          const signupData = await signupResponse.json();

          if (signupData.success) {
            // Automatically log in the user after signup
            login(signupData.user); // Use the user data returned from signup.php

            // Redirect the user
            const checkoutRedirect = localStorage.getItem("checkoutRedirect");
            if (checkoutRedirect) {
              localStorage.removeItem("checkoutRedirect");
              window.location.href = checkoutRedirect;
            } else {
              window.location.href = "/";
            }
          } else {
            throw new Error("Signup failed");
          }
        } else {
          // Handle login after OTP verification
          const userDetailsResponse = await fetch(
            `${API_BASE_URL}/get-user-details.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ phone: formData.phone }),
            }
          );

          if (!userDetailsResponse.ok) {
            const errorData = await userDetailsResponse.json();
            throw new Error(
              errorData.error ||
                `HTTP error! status: ${userDetailsResponse.status}`
            );
          }

          const userDetails = await userDetailsResponse.json();

          if (userDetails.success) {
            login(userDetails.user);

            const pendingSelection = localStorage.getItem(
              "pendingCartSelection"
            );
            if (pendingSelection) {
              try {
                const { path } = JSON.parse(pendingSelection);
                window.location.href = path;
              } catch (error) {
                console.error("Error parsing pending selection:", error);
                localStorage.removeItem("pendingCartSelection");
                window.location.href = "/";
              }
            } else {
              window.location.href = "/";
            }
          } else {
            throw new Error("Failed to fetch user details");
          }
        }
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(error.message || "Unable to verify OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-green-100 transform transition-all duration-300 ease-in-out opacity-100 translate-y-0">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-800 transition-opacity duration-300">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 transform transition-all duration-300 ease-in-out">
            {error}
          </div>
        )}

        {signupSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 transform transition-all duration-300 ease-in-out">
            ✨ Account created successfully! Please login with your phone
            number.
          </div>
        )}

        <form
          onSubmit={showOTP ? verifyOTP : handleSubmit}
          className="space-y-5"
        >
          {!isLogin && !showOTP && (
            <div className="space-y-5 transform transition-all duration-300 ease-in-out">
              <div className="relative group">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 transition-colors duration-200 group-hover:text-green-600"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-green-300"
                  required={!isLogin}
                />
              </div>

              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 transition-colors duration-200 group-hover:text-green-600"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-green-300"
                  required={!isLogin}
                />
              </div>

              <div className="relative group">
                <Home
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 transition-colors duration-200 group-hover:text-green-600"
                  size={20}
                />
                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-green-300 min-h-[100px]"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="relative group">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 transition-colors duration-200 group-hover:text-green-600"
              size={20}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              className="pl-10 w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-green-300"
              required
            />
          </div>

          {showOTP && (
            <div className="relative group transform transition-all duration-300 ease-in-out">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 transition-colors duration-200 group-hover:text-green-600"
                size={20}
              />
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                pattern="[0-9]{6}"
                title="Please enter the 6-digit OTP"
                className="pl-10 w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white hover:border-green-300"
                required={showOTP}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:shadow-lg font-medium hover:scale-[1.01] active:scale-[0.99]"
          >
            {showOTP ? "Verify OTP" : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {!showOTP && (
          <div className="mt-6 text-center text-gray-600 transition-opacity duration-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSignupSuccess(false);
              }}
              className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-200"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;
