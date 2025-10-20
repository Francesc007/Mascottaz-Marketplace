export default function Header() {
    return (
      <header style={{ padding: '30px 20px', backgroundColor: '#fffaf0', textAlign: 'center' }}>
        <div style={{ marginBottom: '8px' }}>
          <h1 
            style={{ 
              color: '#1e3a8a',
              fontSize: '2.5rem',
              fontWeight: '800',
              fontFamily: '"Arial Black", Arial, sans-serif',
              letterSpacing: '2px',
              textShadow: '2px 2px 4px rgba(30, 58, 138, 0.2)',
              margin: '0',
              textTransform: 'uppercase'
            }}
          >
            🐾 PET PLACE
          </h1>
        </div>
        <p 
          style={{ 
            color: '#3b82f6',
            fontSize: '1.8rem',
            fontWeight: '600',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            letterSpacing: '1px',
            margin: '0',
            fontStyle: 'italic',
            textShadow: '1px 1px 2px rgba(59, 130, 246, 0.3)'
          }}
        >
          Porque pensamos en su felicidad
        </p>
      </header>
    );
  }
  