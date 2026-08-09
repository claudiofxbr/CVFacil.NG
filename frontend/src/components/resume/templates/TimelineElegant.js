import React from 'react';

const TimelineElegant = ({ resume, theme, getPhotoUrl }) => {
  const serifFont = "'Playfair Display', serif";
  const sansFont = "'Inter', sans-serif";
  
  return (
    <div style={{
      fontFamily: sansFont,
      color: theme.text,
      background: theme.bg,
      minHeight: '100%',
      padding: '80px 40px'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontFamily: serifFont, fontSize: '3.5rem', fontWeight: 700, margin: 0, letterSpacing: '-1px' }}>
          {resume.fullName}
        </h1>
        <p style={{ fontSize: '1.2rem', color: theme.primary, letterSpacing: '4px', fontWeight: 500, textTransform: 'uppercase', marginTop: '10px' }}>
          {resume.profession}
        </p>
        <div style={{ height: '1px', width: '100px', background: theme.accent, margin: '30px auto' }} />
        <div style={{ fontSize: '0.9rem', opacity: 0.6, display: 'flex', justifyContent: 'center', gap: '30px' }}>
          <span>{resume.phone}</span>
          <span>{resume.contactEmail || resume.user?.email}</span>
          <span>{resume.address}</span>
        </div>
      </header>

      <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
        {/* The Vertical Line */}
        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          top: 0, 
          bottom: 0, 
          width: '1px', 
          background: theme.accent,
          transform: 'translateX(-50%)'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
          {/* Experience Section */}
          <div>
            <div style={{ 
              position: 'relative', 
              textAlign: 'center', 
              background: theme.bg, 
              padding: '0 20px', 
              width: 'max-content', 
              margin: '0 auto 40px auto',
              zIndex: 1,
              fontFamily: serifFont,
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              Experiência Profissional
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {resume.experiences?.map((exp, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: idx % 2 === 0 ? 'flex-end' : 'flex-start',
                  textAlign: idx % 2 === 0 ? 'right' : 'left',
                  width: '100%',
                  position: 'relative'
                }}>
                  {/* The Dot */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: '10px', 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: theme.primary,
                    border: `4px solid ${theme.bg}`,
                    transform: 'translateX(-50%)',
                    zIndex: 2
                  }} />

                  <div style={{ width: '45%' }}>
                    <div style={{ color: theme.primary, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {exp.startDate} — {exp.endDate || 'Presente'}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{exp.position}</h4>
                    <div style={{ fontStyle: 'italic', opacity: 0.7, marginBottom: '12px' }}>{exp.company}</div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div style={{ marginTop: '40px' }}>
            <div style={{ 
              position: 'relative', 
              textAlign: 'center', 
              background: theme.bg, 
              padding: '0 20px', 
              width: 'max-content', 
              margin: '0 auto 40px auto',
              zIndex: 1,
              fontFamily: serifFont,
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              Formação Acadêmica
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {resume.educations?.map((edu, idx) => (
                <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '50%', 
                    top: '10px', 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: theme.accent,
                    transform: 'translateX(-50%)',
                    zIndex: 2
                  }} />
                  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{edu.degree}</h4>
                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{edu.institution}</div>
                    <div style={{ fontSize: '0.8rem', color: theme.primary, marginTop: '4px' }}>{edu.endDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineElegant;
