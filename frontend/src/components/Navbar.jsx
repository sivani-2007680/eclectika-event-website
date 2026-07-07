import React from 'react';

export default function Navbar({ user, cart, onLogin, onOpenSidebar, onOpenCart, onScroll }) {
  return (
    <nav className="navbar">
      <img 
        className="nav-logo" 
        src="https://zenprospect-production.s3.amazonaws.com/uploads/pictures/63c2be55b34a6800019370ee/picture" 
        alt="Logo" 
      />
      <div className="nav-links">
        <button onClick={() => onScroll('home')}>Home</button>
        <button onClick={() => onScroll('events')}>Events</button>
        <button onClick={() => onScroll('sponsors')}>Sponsors</button>
        <button onClick={() => onScroll('merch')}>Merch</button>
        <button onClick={() => onScroll('gallery')}>Gallery</button>

        {/* Auth status trigger button */}
        {user ? (
          <button id="hamburger-btn" className="hamburger-btn" onClick={onOpenSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        ) : (
          <button id="signin-btn" className="nav-signin-btn" onClick={onLogin}>Sign-in</button>
        )}

        {/* Shopping Cart count toggle */}
        <button onClick={onOpenCart} className="cart-toggle">
          🛒 <span className="cart-count">{cart.reduce((s, i) => s + i.qty, 0)}</span>
        </button>
      </div>
    </nav>
  );
}