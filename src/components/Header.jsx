import React, { useState } from 'react';
import AuthModal from './AuthModal';
import audioSpectrum from '../assets/🦆 icon _audio spectrum_.png';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('signin'); // Default to Sign In

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src={audioSpectrum} alt="Audio Spectrum" className="logo-icon" />
           BytePlan
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={modalType} />
    </>
  );
}
