import React from 'react';  // Make sure React is imported
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import MainPage from './pages/mainpage';
import StationPage from './pages/stationpage';
import CarouselPage from './pages/carouselpage';

function App() {
  return (
    <div className="flex h-screen flex-row md:flex-row">
      <Routes>
        {/* Redirect from root ("/") to "/mainpage" */}
        <Route path="/" element={<Navigate to="/mainpage" replace />} />
        <Route path="/mainpage" element={<MainPage />} />
        {/* Route for CarouselPage */}
        <Route path="/StationPage/:id" element={<StationPage />} />
        <Route path="/CarouselPage" element={<CarouselPage />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
