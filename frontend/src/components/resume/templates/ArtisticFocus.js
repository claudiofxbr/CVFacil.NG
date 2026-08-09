import React from 'react';

const ArtisticFocus = ({ resume, theme, getPhotoUrl }) => {
  const boldFont = "'Montserrat', sans-serif";
  
  return (
    <div style={{
      fontFamily: boldFont,
      color: theme.text,
      background: theme.bg,
      minHeight: '100%',
      display: 'flex',
      overflow: 'visible'
    }}>
      {/* Photo Sidebar */}
      <div style={{ width: '35%', background: theme.primary, position: 'relative' }}>
        {resume.photoUrl && (
          <img 
            src={getPhotoUrl(resume.photoUrl)} 
            alt="Profile" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              mixBlendMode: 'multiply',
              filter: 'grayscale(100%)'
            }} 
          />
        )}
        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          left: '40px', 
          right: '40px',
          background: 'rgba(0,0,0,0.8)',
          padding: '24px',
          color: '#fff',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '2px', color: theme.accent, marginBottom: '8px' }}>SAY HELLO</div>
          <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{resume.phone}</div>
          <div style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{resume.contactEmail || resume.user?.email}</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '60px 80px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        <header>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, margin: 0, lineHeight: 0.9, textTransform: 'uppercase' }}>
            {resume.fullName?.split(' ')[0]} <br/> <span style={{ color: theme.primary }}>{resume.fullName?.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div style={{ height: '8px', width: '80px', background: theme.primary, marginTop: '20px' }} />
          <p style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '20px', letterSpacing: '2px' }}>{resume.profession}</p>
        </header>

        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            <div>
              <h3 style={{ fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px', color: theme.primary }}>Summary</h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, opacity: 0.8 }}>{resume.summary}</p>
              
              <h3 style={{ fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '40px', marginBottom: '24px', color: theme.primary }}>Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {resume.skills?.map((skill, i) => (
                  <span key={i} style={{ border: `1px solid ${theme.text}`, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600 }}>{skill.name}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px', color: theme.primary }}>Experience</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {resume.experiences?.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: theme.primary }}>{exp.startDate} – {exp.endDate || 'NOW'}</div>
                    <h4 style={{ margin: '4px 0', fontSize: '1.1rem', fontWeight: 900 }}>{exp.position}</h4>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.7 }}>{exp.company}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArtisticFocus;
