import React from 'react';

const TechStartup = ({ resume, theme, getPhotoUrl }) => {
  const mainFont = "'Public Sans', sans-serif";
  
  return (
    <div style={{
      fontFamily: mainFont,
      color: theme.text,
      background: '#f8fafc',
      minHeight: '100%',
      padding: '40px'
    }}>
      <header style={{ 
        background: '#fff', 
        padding: '32px', 
        borderRadius: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        marginBottom: '32px'
      }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0 }}>
          {resume.photoUrl ? (
            <img src={getPhotoUrl(resume.photoUrl)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: theme.primary, opacity: 0.2 }} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{resume.fullName}</h1>
          <p style={{ color: theme.primary, fontWeight: 600, fontSize: '1.1rem', margin: '4px 0' }}>{resume.profession}</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', opacity: 0.6, marginTop: '8px' }}>
            <span>📍 {resume.address}</span>
            <span>📞 {resume.phone}</span>
            <span>✉ {resume.contactEmail || resume.user?.email}</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Summary Card */}
          <section style={{ background: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: theme.primary }}>✦</span> Resumo
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8, margin: 0 }}>{resume.summary}</p>
          </section>

          {/* Experience List */}
          <section style={{ background: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px' }}>Experiência</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {resume.experiences?.map((exp, idx) => (
                <div key={idx} style={{ paddingLeft: '20px', borderLeft: `2px solid ${theme.primary}22`, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: theme.primary }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>{exp.position}</h4>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: theme.primary }}>{exp.startDate} - {exp.endDate || 'Presente'}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '12px' }}>{exp.company}</div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8, margin: 0 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Skills Card */}
          <section style={{ background: theme.primary, color: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Stacks & Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {resume.skills?.map((skill, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 500 }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

          {/* Education Card */}
          <section style={{ background: '#fff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Formação</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {resume.educations?.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{edu.institution}</div>
                  <div style={{ fontSize: '0.75rem', color: theme.primary, marginTop: '4px' }}>{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TechStartup;
