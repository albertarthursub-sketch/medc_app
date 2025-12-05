import { useState } from 'react';

const LearningModeSelector = ({ onSelectMode, onBack }) => {
  const [selectedMode, setSelectedMode] = useState('lessons');

  const modes = [
    {
      id: 'lessons',
      title: 'Lessons',
      icon: '📚',
      color: 'bg-blue-400',
      description: 'Learn new Twi words'
    },
    {
      id: 'quiz',
      title: 'Quiz',
      icon: '❓',
      color: 'bg-gray-700',
      description: 'Test your knowledge'
    },
    {
      id: 'translate',
      title: 'Translate',
      icon: '🔄',
      color: 'bg-gray-700',
      description: 'Practice translations'
    },
    {
      id: 'library',
      title: 'Library',
      icon: '📖',
      color: 'bg-gray-700',
      description: 'Browse word library'
    }
  ];

  const handleContinue = () => {
    onSelectMode(selectedMode);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2634 100%)',
      overflow: 'hidden',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Status Bar */}
      <div style={{
        height: 51,
        padding: '20px 23px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>12:34</div>
        <div style={{
          display: 'flex',
          gap: 5,
          alignItems: 'center'
        }}>
          <div style={{ width: 16, height: 16, background: '#D9D9D9', borderRadius: 2 }} />
          <div style={{ width: 8, height: 13, background: 'white', borderRadius: 1 }} />
          <div style={{ width: 16, height: 13, background: 'white', borderRadius: 1 }} />
        </div>
      </div>

      {/* Header */}
      <div style={{
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            width: 40,
            height: 40,
            borderRadius: 10,
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          ←
        </button>
        <div>
          <h1 style={{
            color: 'white',
            fontSize: 24,
            fontWeight: '700',
            margin: 0
          }}>Let's start your Learning</h1>
          <p style={{
            color: '#999EA1',
            fontSize: 14,
            fontWeight: '400',
            margin: '4px 0 0 0'
          }}>Choose a learning mode</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '20px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
        marginBottom: 80
      }}>
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            style={{
              padding: '20px',
              background: selectedMode === mode.id ? '#49C0F8' : '#38464F',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.3s ease',
              boxShadow: selectedMode === mode.id ? '0px 8px 0px rgba(0, 0, 0, 0.3)' : '0px 4px 0px rgba(0, 0, 0, 0.25)',
              transform: selectedMode === mode.id ? 'translateY(-4px)' : 'translateY(0)',
              outline: '1px solid #AFAFAF',
              outlineOffset: '-1px'
            }}
            onMouseEnter={(e) => {
              if (selectedMode !== mode.id) {
                e.currentTarget.style.background = '#3f4d5a';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMode !== mode.id) {
                e.currentTarget.style.background = '#38464F';
              }
            }}
          >
            <div style={{
              fontSize: 48,
              lineHeight: 1
            }}>
              {mode.icon}
            </div>
            <div style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '700'
            }}>
              {mode.title}
            </div>
            <div style={{
              color: '#CBD3D7',
              fontSize: 12,
              fontWeight: '400'
            }}>
              {mode.description}
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 16,
        right: 16,
        display: 'flex',
        gap: 10
      }}>
        <button
          onClick={handleContinue}
          style={{
            flex: 1,
            padding: '16px 20px',
            background: '#58CD00',
            border: '1px solid #334148',
            borderRadius: 16,
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0px 4px 0px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0px 6px 0px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0px 4px 0px rgba(0, 0, 0, 0.3)';
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LearningModeSelector;
