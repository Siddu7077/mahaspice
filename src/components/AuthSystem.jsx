import React, { useState } from 'react';
import { User, Phone, Home, Lock } from 'lucide-react';

const AuthSystem = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    otp: ''
  });

  const API_BASE_URL = 'https://mahaspice.desoftimp.com/ms3/login';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const sendOTP = async (phone) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('phone', phone);

      const response = await fetch(`${API_BASE_URL}/send-otp.php`, {
        method: 'POST',
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
        setError('Failed to send OTP. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Unable to send OTP. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      // Login flow
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('phone', formData.phone);

        const response = await fetch(`${API_BASE_URL}/check-user.php`, {
          method: 'POST',
          body: formDataToSend,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.exists) {
          const otpSent = await sendOTP(formData.phone);
          if (otpSent) {
            setShowOTP(true);
          }
        } else {
          setError('User not found. Please sign up.');
          setIsLogin(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Unable to check user. Please try again.');
      }
    } else {
      // Sign up flow - First send OTP
      const otpSent = await sendOTP(formData.phone);
      if (otpSent) {
        setShowOTP(true);
      }
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('otp', formData.otp);

      const response = await fetch(`${API_BASE_URL}/verify-otp.php`, {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (!isLogin) {
          // After OTP verification, proceed with signup
          const signupFormData = new FormData();
          signupFormData.append('name', formData.name);
          signupFormData.append('phone', formData.phone);
          signupFormData.append('address', formData.address);

          const signupResponse = await fetch(`${API_BASE_URL}/signup.php`, {
            method: 'POST',
            body: signupFormData,
          });
          
          if (!signupResponse.ok) {
            throw new Error(`HTTP error! status: ${signupResponse.status}`);
          }
          
          const signupData = await signupResponse.json();
          
          if (signupData.success) {
            setSignupSuccess(true);
            setIsLogin(true);
            setShowOTP(false);
            setError('');
            setFormData({ ...formData, otp: '' });
          } else {
            setError('Signup failed. Please try again.');
          }
        } else {
          // Login success
          window.location.href = 'https://mahaspice.in';
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Unable to verify OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {signupSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            Signup successful! Please login with your phone number.
          </div>
        )}
        
        <form onSubmit={showOTP ? verifyOTP : handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  required={!isLogin}
                />
              </div>
              
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  required={!isLogin}
                />
              </div>
            </>
          )}
          
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          {showOTP && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                pattern="[0-9]{6}"
                title="Please enter the 6-digit OTP"
                className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required={showOTP}
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showOTP ? 'Verify OTP' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        {!showOTP && (
          <p className="mt-4 text-center text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSignupSuccess(false);
              }}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;