import React from 'react';

const ExecutiveClassical = ({ resume, theme, getPhotoUrl }) => {
  const serifFont = "'Libre Baskerville', serif";
  const sansFont = "'Inter', sans-serif";
  
  return (
    <div style={{
      fontFamily: serifFont,
      color: '#333',
      background: '#fff',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Banner */}
      <div style={{ height: '15px', background: theme.primary }} />
      
      <div style={{ padding: '60px 60px 40px 60px', display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: theme.primary }}>{resume.fullName}</h1>
          <p style={{ fontFamily: sansFont, fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 600, color: '#666', marginTop: '5px', textTransform: 'uppercase' }}>
            {resume.profession}
          </p>
        </div>
        <div style={{ textAlign: 'right', fontFamily: sansFont, fontSize: '0.85rem', color: '#888', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>{resume.address}</div>
          <div>{resume.phone}</div>
          <div>{resume.contactEmail || resume.user?.email}</div>
        </div>
      </div>

      <div style={{ padding: '0 60px 60px 60px', display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '60px' }}>
        {/* Left Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <section>
            <h3 style={{ fontSize: '0.9rem', borderTop: '2px solid #333', borderBottom: '2px solid #333', padding: '5px 0', textAlign: 'center', fontFamily: sansFont, fontWeight: 800 }}>CONTATO</h3>
            <div style={{ marginTop: '15px', fontFamily: sansFont, fontSize: '0.85rem', lineHeight: 1.6 }}>
               <div style={{ fontWeight: 700 }}>Email</div>
               <div style={{ marginBottom: '10px' }}>{resume.contactEmail || resume.user?.email}</div>
               <div style={{ fontWeight: 700 }}>LinkedIn</div>
               <div>linkedin.com/in/{resume.fullName?.toLowerCase().replace(' ', '')}</div>
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '0.9rem', borderTop: '2px solid #333', borderBottom: '2px solid #333', padding: '5px 0', textAlign: 'center', fontFamily: sansFont, fontWeight: 800 }}>HABILIDADES</h3>
            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: sansFont, fontSize: '0.85rem' }}>
              {resume.skills?.map((skill, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{skill.name}</span>
                  <span style={{ fontWeight: 700 }}>•</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Content */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <section>
            <h3 style={{ fontSize: '1.2rem', color: theme.primary, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Perfil Profissional</h3>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#444', textAlign: 'justify' }}>{resume.summary}</p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.2rem', color: theme.primary, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Experiência Executiva</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {resume.experiences?.map((exp, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                    <span>{exp.position}</span>
                    <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: '0.85rem' }}>{exp.startDate} - {exp.endDate || 'Presente'}</span>
                  </div>
                  <div style={{ fontStyle: 'italic', color: theme.primary, marginBottom: '10px' }}>{exp.company}</div>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#555', margin: 0 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.2rem', color: theme.primary, borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Formação</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {resume.educations?.map((edu, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{edu.institution}</div>
                  </div>
                  <div style={{ fontFamily: sansFont, fontSize: '0.85rem' }}>{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ExecutiveClassical;
