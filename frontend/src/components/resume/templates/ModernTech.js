import React from 'react';

const ModernTech = ({ resume, theme, getPhotoUrl }) => {
  const sansFont = "'Inter', sans-serif";
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      fontFamily: sansFont,
      color: theme.text,
      background: theme.bg,
      padding: '40px'
    }}>
      {/* Header Area */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', lineHeight: 1.1 }}>
            {resume.fullName?.split(' ')[0]} <span style={{ color: theme.primary }}>{resume.fullName?.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: 500, color: theme.secondary, marginTop: '8px' }}>
            {resume.profession}
          </p>
          <div style={{ maxWidth: '600px', marginTop: '24px', fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.8 }}>
            {resume.summary}
          </div>
        </div>
        
        <div style={{ width: '220px', height: '220px', borderRadius: '24px', overflow: 'hidden', border: `8px solid ${theme.sidebar}`, transform: 'rotate(2deg)' }}>
          {resume.photoUrl ? (
            <img src={getPhotoUrl(resume.photoUrl)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: theme.accent }} />
          )}
        </div>
      </header>

      <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
        {/* Main Sections */}
        <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Experience */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              EXPERIÊNCIA PROFISSIONAL
              <div style={{ flex: 1, height: '1px', background: theme.accent }}></div>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {resume.experiences?.map((exp, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{exp.position}</h4>
                    <span style={{ fontSize: '0.8rem', background: theme.accent, padding: '4px 12px', borderRadius: '12px', color: theme.primary, fontWeight: 700 }}>
                      {exp.startDate} - {exp.endDate || 'Presente'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: theme.primary, fontWeight: 600, fontSize: '1rem', marginBottom: '12px' }}>{exp.company}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {exp.description?.split('\n').map((line, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', opacity: 0.9 }}>
                        <span style={{ color: theme.primary }}>✔</span> {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education as Cards */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>FORMAÇÃO ACADÊMICA</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {resume.educations?.map((edu, idx) => (
                <div key={idx} style={{ background: theme.sidebar, padding: '20px', borderRadius: '16px', border: `1px solid ${theme.accent}` }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{edu.degree}</h4>
                  <p style={{ margin: '4px 0', fontSize: '0.85rem', color: theme.primary }}>{edu.institution}</p>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Contact Box */}
          <div style={{ background: theme.sidebar, padding: '24px', borderRadius: '24px', border: `1px solid ${theme.accent}` }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px' }}>CONTATO</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.primary }}>☏</div>
                {resume.phone}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.primary }}>✉</div>
                {resume.contactEmail || resume.user?.email}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.primary }}>🌐</div>
                {resume.website || 'portfólio.com'}
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 800 }}>HABILIDADES TÉCNICAS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {resume.skills?.map((skill, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                    {skill.name}
                    <span style={{ color: theme.primary }}>{skill.percentage}%</span>
                  </div>
                  <div style={{ height: '6px', background: theme.accent, borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${skill.percentage}%`, height: '100%', background: theme.primary }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          {resume.languages && resume.languages.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>IDIOMAS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {resume.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>{lang.name}</span>
                    <span style={{ color: theme.primary }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {resume.hobbies && resume.hobbies.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>HOBBIES</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {resume.hobbies.map((hobby, i) => (
                  <span key={i} style={{ 
                    fontSize: '0.8rem', 
                    background: theme.accent, 
                    color: theme.primary, 
                    padding: '6px 12px', 
                    borderRadius: '16px', 
                    fontWeight: 600 
                  }}>
                    {hobby.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ModernTech;
