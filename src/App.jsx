// import React, { useState, useEffect } from "react";
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import ScrollToTop from "./components/ScrollToTop";
// import { AuthProvider } from "./components/AuthSystem";
// import LoadingScreen from "./components/LoadingScreen";
// import Developers from "./components/Developers";
// import {EventProvider} from "./components/EventContext"
// // Create a layout component to handle navbar visibility
// const Layout = ({ children }) => {
//   const location = useLocation();
//   const showNavbar = location.pathname !== '/developers';

//   return (
//     <EventProvider>
//     <div className="flex flex-col min-h-screen">
//       {showNavbar && <Navbar />}
//       {children}
//     </div>
//     </EventProvider>
//   );
// };

// const App = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (isLoading) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//   }, [isLoading]);

//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         {isLoading && <LoadingScreen />}
//         <ScrollToTop />
//         <Layout>
        
//           <Routes>
//             <Route path="/developers" element={<Developers />} />
            
//             {/* Add other routes here */}
//           </Routes>
//             {/* <Footer /> */}
          
//         </Layout>
        
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;







import React from 'react';

export default function BlockedSite() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl w-full border-2 border-red-600 rounded-lg p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-red-600 text-center mb-4">WEBSITE BLOCKED</h1>
        
        <hr className="border-red-800 mb-6" />
        
        <div className="space-y-4">
          <p className="text-xl font-medium text-center">
            This website has been temporarily suspended.
          </p>
          
          <p className="text-lg text-center">
            Developer payment has not been processed.
          </p>
          
          <div className="bg-red-900 bg-opacity-40 p-4 rounded border border-red-700 mt-6">
            <p className="text-center">
              Access to this website will be restored once the outstanding payment has been received.
            </p>
          </div>
          
          <div className="mt-8">
            <p className="text-center text-gray-400 text-sm">
              Reference: <span className="font-mono">ERR-PAY-404</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-gray-500 text-sm text-center">
        If you are the site administrator, please contact billing support.
      </div>
    </div>
  );
}
