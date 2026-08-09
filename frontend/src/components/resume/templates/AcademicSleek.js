import React from 'react';

const AcademicSleek = ({ resume, theme, getPhotoUrl }) => {
  const isDark = theme.bg.includes('#0') || theme.bg.includes('#1');
  
  const serifFont = "'Playfair Display', serif";
  const sansFont = "'Inter', sans-serif";

  const SectionHeader = ({ title }) => (
    <div style={{ 
      borderBottom: `1px solid ${theme.accent}`, 
      marginBottom: '1rem', 
      paddingBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h2 style={{ 
        fontFamily: serifFont, 
        fontSize: '1.2rem', 
        color: theme.primary, 
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {title}
      </h2>
      <div style={{ height: '2px', width: '40px', background: theme.primary }}></div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      minHeight: '100%',
      fontFamily: sansFont,
      color: theme.text,
      background: theme.bg
    }}>
      {/* Sidebar */}
      <div style={{
        width: '32%',
        background: theme.sidebar,
        padding: '3rem 2rem',
        borderRight: `1px solid ${theme.accent}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        <div style={{ 
          width: '100%', 
          aspectRatio: '3/4', 
          background: theme.accent, 
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {resume.photoUrl ? (
            <img src={getPhotoUrl(resume.photoUrl)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.secondary }}>PH</div>
          )}
        </div>

        <section>
          <h3 style={{ fontFamily: serifFont, color: theme.primary, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact</h3>
          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0, opacity: 0.8 }}>{resume.contactEmail || resume.user?.email}</p>
            <p style={{ margin: 0, opacity: 0.8 }}>{resume.phone}</p>
            <p style={{ margin: 0, opacity: 0.8 }}>{resume.website}</p>
            <p style={{ margin: 0, opacity: 0.8 }}>{resume.linkedinUrl}</p>
          </div>
        </section>

        <section>
          <h3 style={{ fontFamily: serifFont, color: theme.primary, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Research Areas</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {resume.skills?.slice(0, 6).map((skill, i) => (
              <span key={i} style={{ 
                fontSize: '0.7rem', 
                background: theme.accent, 
                padding: '4px 10px', 
                borderRadius: '20px',
                border: `1px solid rgba(255,255,255,0.05)`
              }}>{skill.name}</span>
            ))}
          </div>
        </section>

        <section>
          <h3 style={{ fontFamily: serifFont, color: theme.primary, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Languages</h3>
          <div style={{ fontSize: '0.85rem' }}>
            {resume.languages?.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>{l.name}</span>
                <span style={{ opacity: 0.6 }}>{l.level}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '4rem 3rem', overflow: 'visible' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            fontFamily: serifFont, 
            fontSize: '3.5rem', 
            margin: 0, 
            lineHeight: 1, 
            color: theme.primary,
            fontStyle: 'italic'
          }}>
            {resume.fullName || 'Seu Nome'}
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            margin: '0.5rem 0 0', 
            letterSpacing: '3px', 
            textTransform: 'uppercase', 
            color: theme.secondary,
            fontWeight: 300
          }}>
            {resume.profession || 'Researcher'}
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <section>
            <SectionHeader title="Profile Overview" />
            <p style={{ lineHeight: 1.8, fontSize: '0.95rem', margin: 0, opacity: 0.9 }}>{resume.summary}</p>
          </section>

          {resume.educations?.length > 0 && (
            <section>
              <SectionHeader title="Academic Formation" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {resume.educations.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{edu.degree}</h4>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{edu.startDate} — {edu.endDate || 'Present'}</span>
                    </div>
                    <p style={{ margin: '2px 0', fontSize: '0.9rem', fontStyle: 'italic', color: theme.secondary }}>{edu.institution}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>{edu.fieldOfStudy}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.experiences?.length > 0 && (
            <section>
              <SectionHeader title="Research & Tenure" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {resume.experiences.map((exp, idx) => (
                  <div key={idx} style={{ position: 'relative', paddingLeft: '20px' }}>
                    <div style={{ position: 'absolute', left: 0, top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: theme.primary }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{exp.position}</h4>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{exp.startDate} — {exp.endDate || 'Present'}</span>
                    </div>
                    <p style={{ margin: '4px 0', fontSize: '0.95rem', fontWeight: 600, color: theme.secondary }}>{exp.company}</p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicSleek;
