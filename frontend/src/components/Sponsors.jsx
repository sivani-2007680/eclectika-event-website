import React from 'react';

export default function Sponsors() {
  return (
    <section id="sponsors" className="sponsors-section">
      <h2 className="section-title">SPONSORS</h2>
      <p className="sponsors-sub">Proudly powered by</p>
      
      <div className="sponsor-stage">
        <div className="sponsor-marquee">
          <div className="sponsor-track">
            {/* Set 1 */}
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/lavkush.png" alt="Lavkush" /></div>
              <span className="sponsor-name">Hotel Lavkush International</span>
            </div>
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/ntpc.png" alt="NTPC" /></div>
              <span className="sponsor-name">NTPC Limited</span>
            </div>
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/domino.png" alt="Domino's" /></div>
              <span className="sponsor-name">Domino's Pizza</span>
            </div>
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/lakme.png" alt="Lakme" /></div>
              <span className="sponsor-name">Lakmé</span>
            </div>
            
            {/* Set 2 (Duplicate for continuous loop) */}
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/lavkush.png" alt="Lavkush" /></div>
              <span className="sponsor-name">Hotel Lavkush International</span>
            </div>
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/ntpc.png" alt="NTPC" /></div>
              <span className="sponsor-name">NTPC Limited</span>
            </div>
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/domino.png" alt="Domino's" /></div>
              <span className="sponsor-name">Domino's Pizza</span>
            </div>
            <div className="sponsor-card">
              <div className="sponsor-img-wrap"><img src="/images/lakme.png" alt="Lakme" /></div>
              <span className="sponsor-name">Lakmé</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
