import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
import audioSpectrum from '../assets/🦆 icon _audio spectrum_.png';
import WaterAnimation from './WaterAnimation';
import WaterTracker from './WaterTracker';

export default function Dashboard() {
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('Overview');
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [colorIndex, setColorIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slideDirection, setSlideDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [waterGoal, setWaterGoal] = useState(() => {
    const saved = localStorage.getItem('waterGoal');
    return saved ? parseInt(saved) : 2000;
  });
  const [waterConsumed, setWaterConsumed] = useState(() => {
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const savedWater = localStorage.getItem(`waterConsumed_${today}`);
    return savedWater ? parseInt(savedWater) : 0;
  });

  // Dummy streak data for upcoming months
  const streakData = {
    // March 2025
    '2025-03': [
      { start: 3, end: 8 },
      { start: 15, end: 21 }
    ],
    // February 2025
    '2025-02': [
      { start: 5, end: 12 },
      { start: 20, end: 25 }
    ],
    // January 2025
    '2025-01': [
      { start: 2, end: 9 },
      { start: 15, end: 22 }
    ],
    // December 2024
    '2024-12': [
      { start: 4, end: 10 },
      { start: 18, end: 26 }
    ]
  };

  // Update water data when localStorage changes or at midnight
  useEffect(() => {
    const handleStorageChange = () => {
      const savedGoal = localStorage.getItem('waterGoal');
      const today = new Date().toISOString().split('T')[0];
      const savedConsumed = localStorage.getItem(`waterConsumed_${today}`);
      if (savedGoal) setWaterGoal(parseInt(savedGoal));
      if (savedConsumed) setWaterConsumed(parseInt(savedConsumed));
    };

    // Check for day change
    const checkDayChange = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const savedDate = localStorage.getItem('currentDate');
      
      if (savedDate !== today) {
        // It's a new day, reset water consumed
        setWaterConsumed(0);
        localStorage.setItem('currentDate', today);
        localStorage.setItem(`waterConsumed_${today}`, '0');
      }
    };

    // Check for day change on component mount and when localStorage changes
    checkDayChange();
    window.addEventListener('storage', handleStorageChange);

    // Set up timer to check for day change
    const midnightCheck = setInterval(() => {
      checkDayChange();
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(midnightCheck);
    };
  }, []);

  // Save water consumed with date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`waterConsumed_${today}`, waterConsumed.toString());
  }, [waterConsumed]);

  // Save water goal
  useEffect(() => {
    localStorage.setItem('waterGoal', waterGoal.toString());
  }, [waterGoal]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const colors = ['#008080', '#87CEEB', '#C4A7E7', '#98FB98', '#FFAB76'];

  // Motivation quotes
  const quotes = [
    {
      text: "Progress is impossible without change, and those who cannot change their minds cannot change anything.",
      author: "— George Bernard Shaw"
    },
    {
      text: "Little by little, one travels far.",
      author: "— J.R.R. Tolkien"
    },
    {
      text: "If you want to make progress, you must leave the shore— you must lose sight of the coast.",
      author: "— André Gide"
    },
    {
      text: "Without continual growth and progress, such words as improvement, achievement, and success have no meaning.",
      author: "— Benjamin Franklin"
    },
    {
      text: "The journey of a thousand miles begins with one step— then one more, and one more.",
      author: "— Lao Tzu"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMonthsDropdownOpen, setIsMonthsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Select Month');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleAddNote = (note) => {
    const newNote = {
      id: Date.now(),
      title: note.title,
      content: note.content,
      color: colors[colorIndex],
      projects: note.projects || []
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };

  const handleAddProject = (projectTitle) => {
    const newProject = {
      id: Date.now(),
      title: projectTitle,
      completed: false
    };
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const handleCheckProject = (projectId) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, completed: !project.completed }
          : project
      )
    );
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    // Also remove this project from any notes that reference it
    setNotes(prevNotes => 
      prevNotes.map(note => ({
        ...note,
        projects: note.projects.filter(id => id !== projectId)
      }))
    );
  };

  const handleProjectTitleChange = (id, newTitle, e) => {
    e.stopPropagation();
    setProjects(projects.map(project => 
      project.id === id ? { ...project, title: newTitle } : project
    ));
  };

  const handleDescriptionChange = (id, newDescription, e) => {
    e.stopPropagation();
    setProjects(projects.map(project => 
      project.id === id ? { ...project, description: newDescription } : project
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleMonthChange = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection(direction);
    
    const newDate = new Date(currentDate);
    if (direction === 'left') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);

    setTimeout(() => {
      setSlideDirection('');
      setIsAnimating(false);
    }, 300);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Water':
        return (
          <div className="water-view">
            <div className="water-rectangle">
              <div className="water-content">
                <div className="water-animation-section">
                  <WaterAnimation />
                </div>
                <div className="water-info-section">
                  <h2>Water Tracker</h2>
                  <p>Set your daily water goal to help you stay on track.</p>
                  <WaterTracker />
                </div>
              </div>
            </div>
          </div>
        );
      case 'Projects':
        return (
          <div className="project-view">
            <div className="project-rectangle">
              <button className="add-project-btn" onClick={() => handleAddProject('New Project')}>+</button>
              <div className="project-content">
                {projects.map((project, index) => (
                  <div key={project.id} className="project-box">
                    <button 
                      className="delete-project-btn" 
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      ×
                    </button>
                    <input
                      type="checkbox"
                      className="project-checkbox"
                      checked={project.completed}
                      onChange={() => handleCheckProject(project.id)}
                    />
                    <input
                      type="text"
                      className="project-title-input"
                      value={project.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        handleProjectTitleChange(project.id, newTitle, e);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="project-description-label">Description:</div>
                    <input
                      type="text"
                      className="project-description-input"
                      value={project.description}
                      onChange={(e) => handleDescriptionChange(project.id, e.target.value, e)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Enter project description"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Notes':
        return (
          <div className="notes-view">
            <div className="notes-rectangle">
              <button className="add-note-btn" onClick={() => handleAddNote({ title: '', content: '' })}>+</button>
              <div className="notes-content">
                {notes.map(note => (
                  <div 
                    key={note.id} 
                    className="note-box"
                    style={{ backgroundColor: note.color }}
                  >
                    <button 
                      className="delete-note-btn"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      ×
                    </button>
                    <textarea 
                      placeholder="Type your note here..."
                      value={note.content}
                      onChange={(e) => {
                        const updatedNotes = notes.map(n => 
                          n.id === note.id ? {...n, content: e.target.value} : n
                        );
                        setNotes(updatedNotes);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Overview':
      default:
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 275px',
            gap: '20px',
            height: '100%',
            width: '100%',
            marginTop: '-50px'
          }}>
            <div style={{ gridColumn: '1', display: 'flex', gap: '20px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                  width: '600px',
                  height: '285px',
                  backgroundColor: '#292929',
                  border: '0.5px solid #A6A6A6',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    Progress Analysis
                  </div>
                  {/* First box content */}
                  <Modal
                    isOpen={isTaskListOpen}
                    onRequestClose={() => setIsTaskListOpen(false)}
                    style={{
                      overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000
                      },
                      content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#202424',
                        borderRadius: '10px',
                        padding: '2rem',
                        width: '600px',
                        height: '400px',
                        border: 'none',
                        overflow: 'hidden'
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <h2 style={{
                        color: '#FFFFFF',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: 0
                      }}>
                        Task List
                      </h2>
                      <button
                        onClick={() => setIsTaskListOpen(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#A6A6A6',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem',
                      height: '100%',
                      justifyContent: 'center'
                    }}>
                      <button
                        className="add-note-btn"
                        style={{
                          width: '50px',
                          height: '50px'
                        }}
                        onClick={() => setIsAddingTask(true)}
                      >
                        +
                      </button>
                      {isAddingTask && (
                        <div style={{
                          width: '100%',
                          marginTop: '1rem'
                        }}>
                          <input
                            type="text"
                            placeholder="Task Name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              borderRadius: '5px',
                              border: '1px solid #A6A6A6',
                              background: '#292929',
                              color: '#FFFFFF',
                              fontSize: '16px'
                            }}
                          />
                          <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.5rem',
                            marginTop: '0.5rem'
                          }}>
                            <button
                              onClick={() => {
                                setIsAddingTask(false);
                                setTaskName('');
                              }}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#292929',
                                color: '#FFFFFF',
                                border: '1px solid #A6A6A6',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'opacity 0.3s'
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                // Add task logic here
                                console.log('Task added:', taskName);
                                setIsAddingTask(false);
                                setTaskName('');
                              }}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#FFFFFF',
                                color: '#000000',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'opacity 0.3s'
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%',
                        marginTop: '1rem'
                      }}>
                        <button
                          onClick={() => setIsTaskListOpen(false)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#292929',
                            color: '#FFFFFF',
                            border: '1px solid #A6A6A6',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'opacity 0.3s'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Modal>
                </div>
                <div style={{
                  width: '475px',
                  height: '285px',
                  backgroundColor: '#292929',
                  border: '0.5px solid #A6A6A6',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '1px'
                  }}>
                    Daily Streak
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginBottom: '1px',
                    marginLeft: '1px',
                    marginTop: '-5px'
                  }}>
                    <button
                      onClick={() => handleMonthChange('left')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#A6A6A6',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {'<'}
                    </button>
                    <div style={{
                      color: '#A6A6A6',
                      fontSize: '16px',
                    }}>
                      {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </div>
                    <button
                      onClick={() => handleMonthChange('right')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#A6A6A6',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {'>'}
                    </button>
                  </div>
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '-10px'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: '2px',
                      padding: '3px',
                      backgroundColor: '#292929',
                      borderRadius: '12px',
                      transform: slideDirection === 'left' ? 'translateX(100%)' : 
                               slideDirection === 'right' ? 'translateX(-100%)' : 
                               'translateX(0)',
                      transition: 'transform 0.3s ease-in-out',
                      opacity: 1,
                      flex: 1
                    }}>
                      <style>
                        {`
                          @keyframes slideInRight {
                            from {
                              transform: translateX(-100%);
                            }
                            to {
                              transform: translateX(0);
                            }
                          }
                          @keyframes slideInLeft {
                            from {
                              transform: translateX(100%);
                            }
                            to {
                              transform: translateX(0);
                            }
                          }
                        `}
                      </style>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} style={{
                          textAlign: 'center',
                          color: 'rgb(85, 167, 221)',
                          fontSize: '15px',
                          fontWeight: 'bold',
                          padding: '4px 0'
                        }}>
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 35 }, (_, i) => {
                        const today = new Date();
                        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        const startingDay = firstDayOfMonth.getDay();
                        const date = i - startingDay + 1;
                        const isToday = date === today.getDate() && 
                                      currentDate.getMonth() === today.getMonth() && 
                                      currentDate.getFullYear() === today.getFullYear();
                        const isCurrentMonth = date > 0 && date <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                        
                        // Check for streaks in current month
                        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                        const monthStreaks = streakData[monthKey] || [];
                        
                        const currentStreak = monthStreaks.find(streak => 
                          date >= streak.start && date <= streak.end
                        );
                        
                        const isStreakDate = !!currentStreak;
                        const isStreakEndpoint = isStreakDate && (
                          date === currentStreak.start || date === currentStreak.end
                        );
                        const isStreakMiddle = isStreakDate && !isStreakEndpoint;
                        
                        // Only show the streak bar at the start of each streak
                        const showStreakBar = monthStreaks.some(streak => date === streak.start);
                        
                        return (
                          <div
                            key={i}
                            style={{
                              position: 'relative',
                              textAlign: 'center',
                              color: isToday ? '#FFFFFF' : (isStreakDate ? '#FFFFFF' : '#000000'),
                              fontSize: '12px',
                              padding: '4px',
                              backgroundColor: isToday ? 'rgb(175, 93, 213)' : 
                                                isStreakEndpoint ? '#975EE0' :
                                                isStreakMiddle ? '#6A4A80' :
                                                isCurrentMonth ? '#D9D9D9' : 'transparent',
                              borderRadius: '50%',
                              width: '27px',
                              height: '27px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              zIndex: isStreakEndpoint && currentStreak?.start === date ? 3 : 1
                            }}
                          >
                            {showStreakBar && (
                              <div style={{
                                position: 'absolute',
                                left: '0',
                                width: `${((currentStreak.end - currentStreak.start + 1) * 27) + ((currentStreak.end - currentStreak.start) * 2)}px`,
                                height: '27px',
                                backgroundColor: '#6A4A80',
                                opacity: 0.6,
                                zIndex: 2,
                                borderRadius: '13.5px'
                              }} />
                            )}
                            {isCurrentMonth ? date : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{
                  width: '350px',
                  height: '265px',
                  backgroundColor: '#292929',
                  border: '0.5px solid #A6A6A6',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {/* Motivation Box */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '22px',
                      fontWeight: 'bold'
                    }}>
                      Motivation
                    </div>
                    <button
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#292929',
                        color: '#FFFFFF',
                        border: '1px solid #A6A6A6',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: 0.9
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                      onClick={() => {
                        setIsTransitioning(true);
                        // Get a random quote
                        const randomIndex = Math.floor(Math.random() * quotes.length);
                        setCurrentQuote(quotes[randomIndex]);
                        // Reset transition after a short delay
                        setTimeout(() => setIsTransitioning(false), 500);
                      }}
                    >
                      Shuffle
                    </button>
                  </div>
                  <div style={{
                    opacity: isTransitioning ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out',
                    color: '#E0E0E0',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    textAlign: 'center',
                    margin: '15px 0',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                    width: '100%'
                  }}>
                    "{currentQuote.text}"
                  </div>
                  <div style={{
                    opacity: isTransitioning ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    marginTop: '8px',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
                  }}>
                    {currentQuote.author}
                  </div>
                </div>
                <div style={{
                  width: '730px',
                  height: '265px',
                  backgroundColor: '#292929',
                  border: '0.5px solid #A6A6A6',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {/* Water Consumption Box */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    position: 'relative'
                  }}>
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '22px',
                      fontWeight: 'bold'
                    }}>
                      Water Consumption
                    </div>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#292929',
                        color: '#FFFFFF',
                        border: '1px solid #A6A6A6',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minWidth: '150px'
                      }}
                      onClick={() => setIsMonthsDropdownOpen(!isMonthsDropdownOpen)}
                    >
                      <span style={{
                        color: selectedMonth === 'Select Month' ? '#A6A6A6' : '#FFFFFF',
                        fontSize: '14px'
                      }}>
                        {selectedMonth}
                      </span>
                      <svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <path d="M1 1L6 6L11 1" stroke="#A6A6A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    {isMonthsDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        backgroundColor: '#292929',
                        border: '1px solid #A6A6A6',
                        borderRadius: '5px',
                        padding: '4px',
                        marginTop: '2px',
                        zIndex: 10,
                        minWidth: '280px'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '4px',
                          padding: '4px'
                        }}>
                          {months.map((month, index) => (
                            <button
                              key={index}
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                background: 'transparent',
                                border: 'none',
                                color: '#FFFFFF',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '12px',
                                borderRadius: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onClick={() => {
                                setSelectedMonth(month);
                                setIsMonthsDropdownOpen(false);
                              }}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ gridColumn: '2' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{
                  width: '300px',
                  height: '200px',
                  backgroundColor: '#292929',
                  border: '0.5px solid #A6A6A6',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  overflow: 'auto'
                }}>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    Projects
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {projects.map(project => (
                      <div
                        key={project.id}
                        style={{
                          backgroundColor: 'rgba(166, 166, 166, 0.33)',
                          border: '0.5px solid #A6A6A6',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{
                          color: '#FCD200',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {project.title}
                        </span>
                        <input
                          type="checkbox"
                          checked={project.completed}
                          onChange={() => handleCheckProject(project.id)}
                          style={{
                            width: '16px',
                            height: '23px',
                            accentColor: '#977EE1',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{
                  width: '300px',
                  height: '100px',
                  backgroundColor: '#292929',
                  border: '0.5px solid #A6A6A6',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: '15px'
                }}>
                  <FontAwesomeIcon 
                    icon={faDroplet} 
                    style={{
                      color: "#977ee1",
                      fontSize: '50px',
                      marginTop: '5px'
                    }
                    
                  } 
                  />
                  <div style={{
                    display: 'flex',
                    fontSize: '90px',
                    fontWeight: 'bold',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{
                      color: '#FFFFFF',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      Water Intake
                    </div>
                    <div style={{
                      color: '#FF58B7',
                      fontSize: '20px'
                    }}>
                      {waterConsumed}ml / {waterGoal}ml
                    </div>
                  </div>
                </div>
                <div style={{
                  width: '300px',
                  height: '240px',
                  backgroundColor: '#292929',
                  border: '0.5px solid #A6A6A6',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  overflow: 'auto'
                }}>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    Notes
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {notes.map(note => (
                      <div
                        key={note.id}
                        style={{
                          backgroundColor: note.color,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          minHeight: '35px',
                          fontSize: '14px',
                          color: '#000000'
                        }}
                      >
                        {note.content.split('\n')[0] || 'Untitled Note'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-top">
          <div className="dashboard-logo">
            <img src={audioSpectrum} alt="Audio Spectrum" className="logo-icon" />
            BytePlan
          </div>
          <nav className="dashboard-nav">
            <button className={`nav-item ${activeView === 'Overview' ? 'active' : ''}`} onClick={() => setActiveView('Overview')}>Overview</button>
            <button className={`nav-item ${activeView === 'Notes' ? 'active' : ''}`} onClick={() => setActiveView('Notes')}>Notes</button>
            <button className={`nav-item ${activeView === 'Projects' ? 'active' : ''}`} onClick={() => setActiveView('Projects')}>Projects</button>
            <button className={`nav-item ${activeView === 'Water' ? 'active' : ''}`} onClick={() => setActiveView('Water')}>Water</button>
          </nav>
          <div className="dashboard-user">
            <span className="user-name">{user?.firstName || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <main className="dashboard-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}