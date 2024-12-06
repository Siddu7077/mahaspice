import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventCatMenu from './components/EventCatMenu';

const App = () => {
  return (
    <>
    <Navbar />
    <Router>
      
        <Routes>
          <Route path="/catmenu" element={<EventCatMenu />} />
        </Routes>
    </Router>
    <Footer /></>
  );
};

export default App;