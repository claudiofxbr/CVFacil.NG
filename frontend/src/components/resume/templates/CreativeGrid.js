import React from 'react';

const CreativeGrid = ({ resume, theme, getPhotoUrl }) => {
  const mainFont = "'Outfit', sans-serif";
  
  return (
    <div style={{
      fontFamily: mainFont,
      color: '#ffffff',
      background: `linear-gradient(135deg, ${theme.bg} 0%, #1a1a2e 100%)`,
       minHeight: '100%',
       padding: '40px',
       position: 'relative',
       overflow: 'visible'
    }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: theme.primary, filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: theme.secondary, filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }} />

      <header style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '60px',
        position: 'relative',
        zIndex: 1 
      }}>
        <div style={{ 
          width: '140px', 
          height: '140px', 
          borderRadius: '40px', 
          overflow: 'hidden', 
          border: '4px solid rgba(255,255,255,0.1)',
          marginBottom: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          transform: 'rotate(-5deg)'
        }}>
          {resume.photoUrl ? (
            <img src={getPhotoUrl(resume.photoUrl)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: theme.primary }} />
          )}
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, textAlign: 'center', letterSpacing: '-1px' }}>
          {resume.fullName}
        </h1>
        <div style={{ 
          marginTop: '10px', 
          background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
          padding: '4px 20px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {resume.profession}
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gridAutoRows: 'minmax(200px, auto)',
        gap: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* About Card */}
        <div style={{ 
          gridColumn: 'span 2', 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '32px',
          padding: '32px'
        }}>
          <h3 style={{ color: theme.primary, marginBottom: '16px', fontSize: '1.2rem' }}>Minha Jornada</h3>
          <p style={{ fontSize: '1rem', lineHeight: 1.7, opacity: 0.8 }}>{resume.summary}</p>
        </div>

        {/* Contact info card */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '32px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>LET'S CHAT</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>{resume.contactEmail || resume.user?.email}</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>{resume.phone}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{resume.address}</div>
        </div>

        {/* Skills Card */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '32px',
          padding: '32px'
        }}>
          <h3 style={{ color: theme.secondary, marginBottom: '20px' }}>Habilidades</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {resume.skills?.map((skill, i) => (
              <span key={i} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '6px 14px', 
                borderRadius: '12px', 
                fontSize: '0.85rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Cards - Rendered differently */}
        {resume.experiences?.slice(0, 2).map((exp, idx) => (
          <div key={idx} style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '32px',
            padding: '32px'
          }}>
            <div style={{ color: theme.primary, fontWeight: 700, marginBottom: '4px' }}>{exp.position}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '12px' }}>{exp.company}</div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, opacity: 0.8, margin: 0 }}>{exp.description?.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreativeGrid;
