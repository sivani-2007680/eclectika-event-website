import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-divider"></div>
      <div className="footer-inner">
        <div className="footer-brand">
          <img className="footer-logo" src="/logo.png" alt="Logo" />
          <div>
            <h4 className="footer-title">ECLECTIKA</h4>
            <p className="footer-tag">NIT Raipur · Annual Fest</p>
          </div>
        </div>
        
        <div className="footer-contact">
          <span className="footer-label">Write to us at</span>
          <a href="mailto:eclectika@nitrr.ac.in" className="footer-mail">eclectika@nitrr.ac.in</a>
        </div>

        <div className="footer-socials" aria-label="Social links">
          <a href="https://www.instagram.com/eclectika_nitrr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
          </a>
          <a href="https://www.facebook.com/eclectika.nitrr/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.6V4.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.6H7.6V14h2.7v8h3.2z"/></svg>
          </a>
          <a href="https://x.com/eclectika_nitrr" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.6 21H1.4l7.5-8.6L1 3h6.6l4.5 6 5.4-6zm-1.1 16h1.8L7.7 4.9H5.8L16.4 19z"/></svg>
          </a>
          <a href="https://www.youtube.com/@EclectikaNitrr" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2c0-1.5-1.2-2.7-2.7-2.7-2.4-.1-4.8-.1-7.3-.1s-4.9 0-7.3.1C3.2 5.5 2 6.7 2 8.2v7.6c0 1.5 1.2 2.7 2.7 2.7 2.4.1 4.8.1 7.3.1s4.9 0 7.3-.1c1.5 0 2.7-1.2 2.7-2.7V8.2zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 <strong>Eclectika®</strong> · NIT Raipur. All rights reserved.</p>
        <p className="footer-credits">Designed &amp; developed by the Eclectika Web Team</p>
      </div>
    </footer>
  );
}