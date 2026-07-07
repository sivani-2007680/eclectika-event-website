import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

// Import our modular sub-components
import Navbar from './components/Navbar';
import About from './components/About';
import Events from './components/Events';
import Sponsors from './components/Sponsors';
import Merch from './components/Merch';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

// Import our modular modal components
import { 
  SidebarDrawer, 
  DashboardModal, 
  PhonePromptModal, 
  EventModal, 
  PhotoUploadModal, 
  FeedbackModal, 
  CartDrawer 
} from './components/Modals';

// Import our static event data catalog (Option 1 Clean-up!)
import { EVENTS_DATA } from './data/eventsData';

const API_BASE = 'https://project-eclecktika-backend.onrender.com/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [livePhotos, setLivePhotos] = useState([]); // Dynamic photos state

  // Drawer / Modals Toggles
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'event', 'feedback', 'photo', 'dashboard'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Shop Variables
  const [cart, setCart] = useState([]);
  const [merchSize, setMerchSize] = useState('M');
  const [teeFlipped, setTeeFlipped] = useState(false);

  // Form states
  const [rating, setRating] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [toast, setToast] = useState('');

  function triggerToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      fetchRegistrations(parsed._id);
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    fetchLivePhotos(); // Fetch approved moments on startup
  }, []);

  async function fetchRegistrations(userId) {
    try {
      const res = await axios.get(`${API_BASE}/events/my-registrations/${userId}`);
      if (res.data.success) setRegistrations(res.data.registrations);
    } catch (e) { console.error("Error loading tickets:", e); }
  }

  async function fetchLivePhotos() {
    try {
      const res = await axios.get(`${API_BASE}/gallery/live`);
      if (res.data.success) setLivePhotos(res.data.photos);
    } catch (e) {
      console.error("Error loading gallery live moments:", e);
    }
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${API_BASE}/auth/google`, { token: tokenResponse.access_token });
        if (res.data.success) {
          const loggedInUser = res.data.user;
          setUser(loggedInUser);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          if (!loggedInUser.phone) {
            setShowPhonePrompt(true);
          } else {
            fetchRegistrations(loggedInUser._id);
            triggerToast(`Welcome back, ${loggedInUser.name}!`);
          }
        }
      } catch (err) { alert("Google Sign-In failed."); }
    }
  });

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      alert("Please enter a valid 10-digit number.");
      return;
    }
    try {
      const res = await axios.put(`${API_BASE}/auth/update-phone`, { userId: user._id, phone: phoneInput });
      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowPhonePrompt(false);
        fetchRegistrations(updatedUser._id);
        triggerToast("Profile creation complete!");
      }
    } catch (e) { alert("Error saving profile details."); }
  }

  async function handleEventRegister(eventName) {
    if (!user) {
      alert("Please sign in first to register for events.");
      login();
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/events/register`, { userId: user._id, eventName });
      if (res.data.success) {
        const updatedRegs = [...registrations, res.data.registration];
        setRegistrations(updatedRegs);
        triggerToast(`Registered successfully for ${eventName}!`);
        setSelectedEvent(prev => ({ ...prev, registered: true, ticketId: res.data.registration.ticketId }));
      }
    } catch (e) { alert("Registration error."); }
  }

  async function handleEventUnregister(eventName) {
    if (window.confirm(`Are you sure you want to unregister from ${eventName}?`)) {
      try {
        const res = await axios.post(`${API_BASE}/events/unregister`, { userId: user._id, eventName });
        if (res.data.success) {
          setRegistrations(registrations.filter(r => r.eventName !== eventName));
          triggerToast(`Unregistered from ${eventName}.`);
          setSelectedEvent(prev => ({ ...prev, registered: false, ticketId: null }));
        }
      } catch (e) { alert("Unregistration error."); }
    }
  }

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      alert("Please rate using the stars.");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/feedback/submit`, {
        userId: user._id,
        userName: user.name,
        rating,
        message: feedbackMsg
      });
      if (res.data.success) {
        setActiveModal(null);
        setRating(0);
        setFeedbackMsg('');
        triggerToast("Thank you for your feedback!");
      }
    } catch (e) { alert("Error submitting review."); }
  }

  async function handlePhotoUpload(e) {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a file first.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onloadend = async () => {
      try {
        const res = await axios.post(`${API_BASE}/gallery/contribute`, {
          imageUrl: reader.result,
          userId: user._id,
          userName: user.name
        });
        if (res.data.success) {
          setActiveModal(null);
          setUploadFile(null);
          triggerToast("Photo sent to admin review queue!");
        }
      } catch (e) { alert("Upload error."); }
    };
  }

  function handleSignOut() {
    setUser(null);
    setRegistrations([]);
    localStorage.removeItem('user');
    setSidebarOpen(false);
    triggerToast("Signed out successfully.");
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  }

  function addToCart() {
    const itemKey = `Tee::${merchSize}`;
    let updatedCart = [...cart];
    const existing = updatedCart.find(i => i.key === itemKey);
    if (existing) {
      existing.qty += 1;
    } else {
      updatedCart.push({ key: itemKey, size: merchSize, qty: 1, price: 599, name: "Eclectika '26 Official Tee" });
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    triggerToast("Added to Cart!");
  }

  function updateCartQty(key, inc) {
    let updated = cart.map(item => {
      if (item.key === key) return { ...item, qty: Math.max(0, item.qty + inc) };
      return item;
    }).filter(item => item.qty > 0);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div>
      {/* 1. Header Navigation */}
      <Navbar 
        user={user} 
        cart={cart} 
        onLogin={login} 
        onOpenSidebar={() => setSidebarOpen(true)} 
        onOpenCart={() => setCartOpen(true)} 
        onScroll={scrollToSection} 
      />

      {/* 2. Hero Landing Header */}
      <main id="home" className="hero">
        <img className="main-logo" src="/logo.png" alt="Eclectika Logo" />
        <h1 className="head">ECLECTIKA</h1>
      </main>

      {/* 3. About Section */}
      <About />

      {/* 4. Events Section */}
      <Events 
        eventsData={EVENTS_DATA} 
        registrations={registrations} 
        onOpenEventModal={(key) => {
          const reg = registrations.find(r => r.eventName === key);
          setSelectedEvent({ name: key, ...EVENTS_DATA[key], registered: !!reg, ticketId: reg?.ticketId });
          setActiveModal('event');
        }} 
      />

      {/* 5. Sponsors Section */}
      <Sponsors />

      {/* 6. Merchandise Section */}
      <Merch 
        merchSize={merchSize} 
        setMerchSize={setMerchSize} 
        teeFlipped={teeFlipped} 
        setTeeFlipped={setTeeFlipped} 
        onAddToCart={addToCart} 
      />

      {/* 7. Gallery Section */}
      <Gallery livePhotos={livePhotos} />

      {/* 8. Footer Section */}
      <Footer />

      {/* ======================================================== */}
      {/* 🛠️ Overlay Drawer / Modal Controller                        */}
      {/* ======================================================== */}
      
      {/* Sidebar Navigation Drawer */}
      <SidebarDrawer 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={user} 
        onNavigateDashboard={() => { setSidebarOpen(false); setActiveModal('dashboard'); }} 
        onNavigatePhoto={() => { setSidebarOpen(false); setActiveModal('photo'); }} 
        onNavigateFeedback={() => { setSidebarOpen(false); setActiveModal('feedback'); }} 
        onSignOut={handleSignOut} 
        onScroll={scrollToSection} 
      />

      {/* Registered Passcodes Dashboard */}
      <DashboardModal 
        isOpen={activeModal === 'dashboard'} 
        onClose={() => setActiveModal(null)} 
        registrations={registrations} 
        onUnregister={handleEventUnregister} 
      />

      {/* Profile Phone Number Prompt */}
      <PhonePromptModal 
        isOpen={showPhonePrompt} 
        phoneInput={phoneInput} 
        setPhoneInput={setPhoneInput} 
        onSubmit={handlePhoneSubmit} 
      />

      {/* Detailed Event Pass Specifications */}
      <EventModal 
        isOpen={activeModal === 'event'} 
        onClose={() => setActiveModal(null)} 
        selectedEvent={selectedEvent} 
        onRegister={handleEventRegister} 
        onUnregister={handleEventUnregister} 
      />

      {/* Photo Contribution Upload Modal */}
      <PhotoUploadModal 
        isOpen={activeModal === 'photo'} 
        onClose={() => setActiveModal(null)} 
        uploadFile={uploadFile} 
        setUploadFile={setUploadFile} 
        onSubmit={handlePhotoUpload} 
      />

      {/* Feedback Reviews Rating Form */}
      <FeedbackModal 
        isOpen={activeModal === 'feedback'} 
        onClose={() => setActiveModal(null)} 
        rating={rating} 
        setRating={setRating} 
        feedbackMsg={feedbackMsg} 
        setFeedbackMsg={setFeedbackMsg} 
        onSubmit={handleFeedbackSubmit} 
      />

      {/* Shopping Cart Drawer Overlay */}
      <CartDrawer 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cart={cart} 
        onUpdateQty={updateCartQty} 
        onCheckout={() => {
          alert(`Order placed successfully! Total sum: ₹${cartTotal}`);
          setCart([]);
          localStorage.removeItem('cart');
          setCartOpen(false);
        }} 
        total={cartTotal} 
      />

      {/* Notification Toast Alert */}
      {toast && (
        <div style={{position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg, #00c6ff, #0072ff)', color:'white', padding:'12px 30px', borderRadius:'30px', boxShadow:'0 10px 25px rgba(0,198,255,0.3)', zIndex:'3000', fontWeight:'600', animation:'fadeIn 0.3s ease'}}>
          {toast}
        </div>
      )}
    </div>
  );
}