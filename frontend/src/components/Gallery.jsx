import React from 'react';

export default function Gallery({ livePhotos = [] }) {
  return (
    <section id="gallery" className="gallery-section">
      <h2 className="section-title">GALLERY</h2>
      <p className="gallery-sub">Moments from past editions</p>
      
      <div className="gallery-stage">
        <div className="gallery-grid">
          {/* Column 1 - Scrolls UP */}
          <div className="gallery-col">
            <div className="gallery-track track-up">
              <div className="gallery-item"><img src="/images/g1.png" alt="G1" /></div>
              <div className="gallery-item"><img src="/images/g2.png" alt="G2" /></div>
              <div className="gallery-item"><img src="/images/g3.png" alt="G3" /></div>
              {/* Duplicate for infinite loop */}
              <div className="gallery-item"><img src="/images/g1.png" alt="G1" /></div>
              <div className="gallery-item"><img src="/images/g2.png" alt="G2" /></div>
              <div className="gallery-item"><img src="/images/g3.png" alt="G3" /></div>
            </div>
          </div>
          
          {/* Column 2 - Scrolls DOWN */}
          <div className="gallery-col">
            <div className="gallery-track track-down">
              <div className="gallery-item"><img src="/images/g6.png" alt="G6" /></div>
              <div className="gallery-item"><img src="/images/g7.png" alt="G7" /></div>
              <div className="gallery-item"><img src="/images/g8.png" alt="G8" /></div>
              {/* Duplicate for infinite loop */}
              <div className="gallery-item"><img src="/images/g6.png" alt="G6" /></div>
              <div className="gallery-item"><img src="/images/g7.png" alt="G7" /></div>
              <div className="gallery-item"><img src="/images/g8.png" alt="G8" /></div>
            </div>
          </div>

          {/* Column 3 - Scrolls UP */}
          <div className="gallery-col">
            <div className="gallery-track track-up">
              <div className="gallery-item"><img src="/images/g11.png" alt="G11" /></div>
              <div className="gallery-item"><img src="/images/g12.png" alt="G12" /></div>
              <div className="gallery-item"><img src="/images/g13.png" alt="G13" /></div>
              <div className="gallery-item"><img src="/images/g14.png" alt="G14" /></div>
              {/* Duplicate for infinite loop */}
              <div className="gallery-item"><img src="/images/g11.png" alt="G11" /></div>
              <div className="gallery-item"><img src="/images/g12.png" alt="G12" /></div>
              <div className="gallery-item"><img src="/images/g13.png" alt="G13" /></div>
              <div className="gallery-item"><img src="/images/g14.png" alt="G14" /></div>
            </div>
          </div>
        </div>
      </div>
             {/* Live Dynamic Student Contributions */}
      {livePhotos.length > 0 && (
        <div style={{ marginTop: '70px', padding: '0 20px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#00c6ff', marginBottom: '25px', letterSpacing: '3px', textTransform: 'uppercase' }}>
            📸 Live Student Contributions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px', maxWidth: '1000px', margin: '0 auto' }}>
            {livePhotos.map(photo => (
              <div key={photo._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', transition: 'transform 0.3s' }}>
                <img src={photo.imageUrl} alt="Live Moment" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '10px 14px', fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>By: <strong>{photo.userName}</strong></span>
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>✓ Approved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} 
    </section>
  );
}