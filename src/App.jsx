import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import './App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('signup');

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Header />
      <main className="hero">
        <h1 className="main-text">Streamline your <span style={{color: "#C5AFD7"}}>Workflow</span> byte by byte.</h1>
        <h3 className='sub-text'>Unlock your full potential with intelligent task management. Stay ahead, work smarter, and let technology drive your success with BytePlan.</h3>
        <button className="cta-btn" onClick={openModal}>Get Started</button>
      </main>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={modalType} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
                <Dashboard />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
