import React, { useState, useEffect } from 'react';

const WaterTracker = () => {
  const [goal, setGoal] = useState(2000); // Default goal: 2000ml
  const [consumed, setConsumed] = useState(0);
  const [inputAmount, setInputAmount] = useState('');

  // Load saved data from localStorage
  useEffect(() => {
    const savedGoal = localStorage.getItem('waterGoal');
    const savedConsumed = localStorage.getItem('waterConsumed');
    if (savedGoal) setGoal(parseInt(savedGoal));
    if (savedConsumed) setConsumed(parseInt(savedConsumed));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('waterGoal', goal.toString());
    localStorage.setItem('waterConsumed', consumed.toString());
  }, [goal, consumed]);

  const handleAddWater = () => {
    const amount = parseInt(inputAmount) || 0;
    if (amount > 0) {
      setConsumed(prev => prev + amount);
      setInputAmount('');
    }
  };

  const handleRemoveWater = () => {
    const amount = parseInt(inputAmount) || 0;
    if (amount > 0) {
      setConsumed(prev => Math.max(0, prev - amount));
      setInputAmount('');
    }
  };

  const progress = (consumed / goal) * 100;
  const progressColor = progress >= 100 ? '#FF58B7' : '#BE7AE0';

  return (
    <div className="water-tracker">
      <div className="water-goal-section">
        <h3>Daily Water Goal</h3>
        
        <div className="goal-input">
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="water-input"
          />
          <span>ml</span>
        </div>
      </div>

      <div className="water-progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: progressColor
            }}
          />
        </div>
        <div className="progress-text">
          <span>{consumed}ml</span>
          <span>of</span>
          <span>{goal}ml</span>
        </div>
      </div>

      <div className="water-controls">
        <div className="amount-input">
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            className="water-input"
          />
          <span>ml</span>
        </div>
        <div className="control-buttons">
          <button 
            className="add-water-btn"
            onClick={handleAddWater}
          >
            +
          </button>
          <button 
            className="remove-water-btn"
            onClick={handleRemoveWater}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker; 