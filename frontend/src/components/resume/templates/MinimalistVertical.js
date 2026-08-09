import React from 'react';

const MinimalistVertical = ({ resume, theme, getPhotoUrl }) => {
  const sansFont = "'Inter', sans-serif";
  
  return (
    <div style={{
      fontFamily: sansFont,
      color: theme.text,
      background: theme.bg,
      minHeight: '100%',
      padding: '60px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: '60px'
    }}>
      {/* Centered Header */}
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 300, letterSpacing: '8px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
          {resume.fullName}
        </h1>
        <p style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '4px', color: theme.primary, textTransform: 'uppercase', marginBottom: '24px' }}>
          {resume.profession}
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          fontSize: '0.8rem', 
          opacity: 0.6,
          fontWeight: 500
        }}>
          <span>{resume.phone}</span>
          <span>•</span>
          <span>{resume.contactEmail || resume.user?.email}</span>
          <span>•</span>
          <span>{resume.address}</span>
        </div>
      </header>

      {/* Summary */}
      <section style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 400, fontStyle: 'italic', opacity: 0.8 }}>
          "{resume.summary}"
        </p>
      </section>

      {/* Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '80px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Left Column: Experience */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <section>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px', borderBottom: `1px solid ${theme.accent}`, paddingBottom: '8px' }}>
              Experiência
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {resume.experiences?.map((exp, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{exp.position}</h4>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{exp.startDate} — {exp.endDate || 'Presente'}</span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: theme.primary, fontWeight: 500 }}>{exp.company}</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.7 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px', borderBottom: `1px solid ${theme.accent}`, paddingBottom: '8px' }}>
              Educação
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {resume.educations?.map((edu, idx) => (
                <div key={idx}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{edu.degree}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{edu.institution}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Skills & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <section>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px', borderBottom: `1px solid ${theme.accent}`, paddingBottom: '8px' }}>
              Expertise
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {resume.skills?.map((skill, i) => (
                <span key={i} style={{ 
                  fontSize: '0.8rem', 
                  padding: '6px 14px', 
                  border: `1px solid ${theme.accent}`,
                  borderRadius: '20px',
                  fontWeight: 500
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Contact Details */}
          <section>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px', borderBottom: `1px solid ${theme.accent}`, paddingBottom: '8px' }}>
              Social
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ color: theme.primary, fontWeight: 600 }}>LinkedIn</div>
              <div style={{ opacity: 0.6 }}>linkedin.com/in/{resume.fullName?.toLowerCase().replace(' ', '')}</div>
              
              <div style={{ color: theme.primary, fontWeight: 600, marginTop: '10px' }}>Github</div>
              <div style={{ opacity: 0.6 }}>github.com/{resume.fullName?.toLowerCase().replace(' ', '')}</div>
            </div>
          </section>
          
          {resume.photoUrl && (
             <section style={{ textAlign: 'center', marginTop: '20px' }}>
                <img 
                  src={getPhotoUrl(resume.photoUrl)} 
                  alt="Profile" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    filter: 'grayscale(100%)', 
                    borderRadius: '50%',
                    border: `1px solid ${theme.accent}`,
                    padding: '5px'
                  }} 
                />
             </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalistVertical;
