import React from 'react';
import { LogOut, X, Upload } from 'lucide-react';

// 1. HAMBURGER SIDEBAR MENU DRAWER
export function SidebarDrawer({ isOpen, onClose, user, onNavigateDashboard, onNavigatePhoto, onNavigateFeedback, onSignOut, onScroll }) {
  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
          <h3>ECLECTIKA MENU</h3>
          <button className="sidebar-close" onClick={onClose}><X /></button>
        </div>
        <div className="sidebar-profile">
          <span className="sidebar-avatar">👤</span>
          <div>
            <h4>{user?.name || 'Guest'}</h4>
            <p>{user?.email || ''}</p>
          </div>
        </div>
        <div className="sidebar-links">
          <button onClick={() => { onClose(); onScroll('home'); }}>Home Section</button>
          <button onClick={onNavigateDashboard}>My Registered Events</button>
          <button onClick={onNavigatePhoto}>Contribute Photo</button>
          <button onClick={onNavigateFeedback}>Send Feedback</button>
          <button className="menu-signout-btn" onClick={onSignOut}><LogOut size={16} /> Sign Out</button>
        </div>
      </div>
    </>
  );
}

// 2. MY REGISTERED PASSES DASHBOARD
export function DashboardModal({ isOpen, onClose, registrations, onUnregister }) {
  return (
    <div className={`event-modal-backdrop ${isOpen ? 'open' : ''}`}>
      <div className="event-modal-content">
        <button className="event-modal-close" onClick={onClose}><X /></button>
        <div className="event-modal-body">
          <h3>Registered Passcodes</h3>
          <div id="dash-events-list">
            {registrations.length === 0 ? (
              <div className="dash-empty-state">No registered events. Browse and register on the homepage!</div>
            ) : (
              registrations.map(reg => (
                <div key={reg._id} className="dash-event-card">
                  <div className="dash-event-info">
                    <h5>{reg.eventName}</h5>
                    <span className="dash-event-status">{reg.verified ? '✓ Admitted' : '✓ Registered'}</span>
                  </div>
                  <button className="event-unreg-btn" onClick={() => onUnregister(reg.eventName)}>Unregister</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. ONE-TIME PROFILE PHONE NUMBER PROMPT
export function PhonePromptModal({ isOpen, phoneInput, setPhoneInput, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className={`event-modal-backdrop open`}>
      <div className="event-modal-content">
        <div className="event-modal-body">
          <h3 style={{color:'#00c6ff'}}>Complete Profile</h3>
          <p>Welcome! Please enter your 10-digit mobile number to complete your registration setup.</p>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Mobile Phone Number</label>
              <input 
                type="tel" 
                value={phoneInput} 
                onChange={e => setPhoneInput(e.target.value)} 
                placeholder="e.g. 9876543210" 
                required 
              />
            </div>
            <button type="submit" className="event-reg-btn" style={{width:'100%'}}>Save Phone Number</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 4. SPECIFIC EVENT SPECIFICATIONS MODAL
export function EventModal({ isOpen, onClose, selectedEvent, onRegister, onUnregister }) {
  if (!isOpen || !selectedEvent) return null;
  return (
    <div className={`event-modal-backdrop open`}>
      <div className="event-modal-content">
        <button className="event-modal-close" onClick={onClose}><X /></button>
        <div className="event-modal-hero">
          <img src={selectedEvent.image} alt="Event Hero" />
        </div>
        <div className="event-modal-body">
          <h3>{selectedEvent.title}</h3>
          <p>{selectedEvent.desc}</p>
          
          <div className="event-details-row">
            <div className="event-detail-item">
              <div className="event-detail-label">📍 Venue</div>
              <div className="event-detail-val">{selectedEvent.venue}</div>
            </div>
            <div className="event-detail-item">
              <div className="event-detail-label">🕒 Date & Time</div>
              <div className="event-detail-val">{selectedEvent.time}</div>
            </div>
          </div>

          {selectedEvent.isRegistrationRequired && (
            <div className="registration-area">
              {selectedEvent.registered ? (
                <div className="ticket-container">
                  <img 
                    className="qr-code-img" 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedEvent.ticketId)}`} 
                    alt="Ticket" 
                  />
                  <span className="ticket-status">✓ TICKET GENERATED</span>
                  <span style={{fontSize: '0.75rem', color: '#888'}}>TICKET ID: {selectedEvent.ticketId}</span>
                  <button className="event-modal-unreg-btn" onClick={() => onUnregister(selectedEvent.name)}>Unregister Event</button>
                </div>
              ) : (
                <button className="event-reg-btn" onClick={() => onRegister(selectedEvent.name)}>Register for Event</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. GALLERY PHOTO SUBMISSION MODAL
export function PhotoUploadModal({ isOpen, onClose, uploadFile, setUploadFile, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className={`event-modal-backdrop open`}>
      <div className="event-modal-content">
        <button className="event-modal-close" onClick={onClose}><X /></button>
        <div className="event-modal-body">
          <h3>Contribute Photos</h3>
          <p>Upload a memory snapshot. Admins will review it before rendering it in the main homepage gallery grid.</p>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Select Picture File</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setUploadFile(e.target.files[0])} 
                required 
              />
            </div>
            <button type="submit" className="event-reg-btn" style={{width:'100%'}}><Upload size={16} /> Submit for Review</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 6. USER STAR RATING REVIEW MODAL
export function FeedbackModal({ isOpen, onClose, rating, setRating, feedbackMsg, setFeedbackMsg, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className={`event-modal-backdrop open`}>
      <div className="event-modal-content">
        <button className="event-modal-close" onClick={onClose}><X /></button>
        <div className="event-modal-body">
          <h3>Feedback Rating</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Star Score</label>
              <div style={{display:'flex', gap:'10px', fontSize:'2rem', cursor:'pointer'}}>
                {[1, 2, 3, 4, 5].map(val => (
                  <span 
                    key={val} 
                    style={{color: val <= rating ? '#ffaa00' : 'rgba(255,255,255,0.2)'}} 
                    onClick={() => setRating(val)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Review Description</label>
              <textarea 
                rows="4" 
                value={feedbackMsg} 
                onChange={e => setFeedbackMsg(e.target.value)} 
                placeholder="Type review text here..." 
                required 
              />
            </div>
            <button type="submit" className="event-reg-btn" style={{width:'100%'}}>Send Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 7. SHOPPING CART DRAWER
export function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onCheckout, total }) {
  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar-drawer ${isOpen ? 'open' : ''}`} style={{right: isOpen ? '0' : '-320px'}}>
        <div className="sidebar-head">
          <h3>Your Shopping Cart</h3>
          <button className="sidebar-close" onClick={onClose}><X /></button>
        </div>
        <div style={{flex:'1', overflowY:'auto'}}>
          {cart.length === 0 ? (
            <div style={{textAlign:'center', color:'#888', marginTop:'50px'}}>Your shopping bag is empty.</div>
          ) : (
            cart.map(item => (
              <div key={item.key} style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', paddingBottom:'10px', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                <div>
                  <h5 style={{fontSize:'0.9rem', color:'white'}}>{item.name}</h5>
                  <span style={{fontSize:'0.75rem', color:'#888'}}>Size: {item.size}</span>
                  <div style={{marginTop:'5px'}}>
                    <button style={{color:'white', background:'none', border:'none', padding:'0 5px', cursor:'pointer'}} onClick={() => onUpdateQty(item.key, -1)}>-</button>
                    <span style={{padding:'0 8px'}}>{item.qty}</span>
                    <button style={{color:'white', background:'none', border:'none', padding:'0 5px', cursor:'pointer'}} onClick={() => onUpdateQty(item.key, 1)}>+</button>
                  </div>
                </div>
                <span style={{fontWeight:'600'}}>₹{item.price * item.qty}</span>
              </div>
            ))
          )}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'15px'}}>
          <div style={{display:'flex', justifycontent:'space-between', marginBottom:'15px'}}>
            <span>Cart Sum Total</span>
            <span style={{fontWeight:'bold', color:'#00c6ff'}}>₹{total}</span>
          </div>
          <button 
            className="add-cart-btn" 
            style={{width:'100%'}} 
            disabled={cart.length === 0} 
            onClick={onCheckout}
          >
            Complete Order
          </button>
        </div>
      </div>
    </>
  );
}