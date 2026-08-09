import React from 'react';

const SimpleClean = ({ resume, theme, getPhotoUrl }) => {
  const mainFont = "'Inter', sans-serif";
  
  return (
    <div style={{
      fontFamily: mainFont,
      color: '#2d3436',
      background: '#fff',
      minHeight: '100%',
      padding: '60px'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${theme.primary}`, paddingBottom: '30px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: theme.primary, letterSpacing: '-1px' }}>{resume.fullName}</h1>
          <p style={{ fontSize: '1.2rem', color: '#636e72', fontWeight: 500, margin: '8px 0' }}>{resume.profession}</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#636e72', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span>{resume.address}</span>
          <span>{resume.phone}</span>
          <span>{resume.contactEmail || resume.user?.email}</span>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: theme.primary, letterSpacing: '1px', marginBottom: '16px' }}>Perfil Profissional</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#2d3436', margin: 0 }}>{resume.summary}</p>
        </section>

        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: theme.primary, letterSpacing: '1px', marginBottom: '24px' }}>Experiência Profissional</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {resume.experiences?.map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{exp.position}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#636e72' }}>{exp.startDate} - {exp.endDate || 'Presente'}</span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#b2bec3', marginBottom: '10px' }}>{exp.company}</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#2d3436', margin: 0 }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px' }}>
          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: theme.primary, letterSpacing: '1px', marginBottom: '24px' }}>Formação</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {resume.educations?.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.9rem', color: '#636e72' }}>{edu.institution}</div>
                  <div style={{ fontSize: '0.8rem', color: theme.primary, marginTop: '2px' }}>{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', color: theme.primary, letterSpacing: '1px', marginBottom: '24px' }}>Habilidades</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {resume.skills?.map((skill, i) => (
                <span key={i} style={{ 
                  background: '#f1f2f6', 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  fontSize: '0.85rem', 
                  color: '#2d3436',
                  fontWeight: 500
                }}>{skill.name}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SimpleClean;
