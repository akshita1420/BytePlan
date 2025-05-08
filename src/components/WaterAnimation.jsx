import React from 'react';
import Lottie from 'lottie-react';
import waterAnimation from '../assets/waterAnimation.json';

const WaterAnimation = () => {
  return (
    <div className="water-animation-container">
      <Lottie
        animationData={waterAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  );
};

export default WaterAnimation; 