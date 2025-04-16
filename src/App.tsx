import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MissingPersons from './pages/MissingPersons';
import StolenVehicles from './pages/StolenVehicles';
import LostAndFound from './pages/LostAndFound';
import ReportCase from './pages/ReportCase';
import Donations from './pages/Donations';
import CaseDetails from './pages/CaseDetails';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/missing-persons" element={<MissingPersons />} />
            <Route path="/stolen-vehicles" element={<StolenVehicles />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            <Route path="/report" element={<ReportCase />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/case/:id" element={<CaseDetails />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App;