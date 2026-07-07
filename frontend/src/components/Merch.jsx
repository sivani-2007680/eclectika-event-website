import React from 'react';

export default function Merch({ merchSize, setMerchSize, teeFlipped, setTeeFlipped, onAddToCart }) {
  return (
    <section id="merch" className="merch-section">
      <h2 className="section-title">MERCH</h2>
      <div className="merch-stage">
        <div className="merch-wrap">
          <div className={`tee-scene ${teeFlipped ? 'flipped' : ''}`} onClick={() => setTeeFlipped(!teeFlipped)}>
            <div className="tee-card">
              <div className="tee-face tee-front">
                <img src="/images/merchF.png" alt="Tee Front" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                <span className="tee-tag">FRONT</span>
              </div>
              <div className="tee-back tee-face">
                <img src="/images/merchB.png" alt="Tee Back" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                <span className="tee-tag">BACK</span>
              </div>
            </div>
            <p className="tee-hint">click to flip · hover to pause</p>
          </div>
          
          <div className="tee-details">
            <span className="tee-badge">LIMITED DROP</span>
            <h3 className="tee-title">Eclectika '26 Official Tee</h3>
            <p className="tee-desc">Premium 100% combed cotton · oversized fit · screen-printed artwork on front & back. Designed by the NIT Raipur design team.</p>
            <div className="tee-price-row">
              <span className="tee-price">₹599</span>
            </div>
            <div className="tee-size-block">
              <span className="tee-label">Select size</span>
              <div className="tee-sizes">
                {['S', 'M', 'L', 'XL'].map(s => (
                  <button key={s} className={`size-btn ${merchSize === s ? 'active' : ''}`} onClick={() => setMerchSize(s)}>{s}</button>
                ))}
              </div>
            </div>
            <button className="add-cart-btn" onClick={onAddToCart}>Add to Cart →</button>
          </div>
        </div>
      </div>
    </section>
  );
}