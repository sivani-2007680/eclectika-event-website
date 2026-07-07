import React from 'react';

export default function Events({ eventsData, registrations, onOpenEventModal }) {
  const eventKeys = Object.keys(eventsData);
  const openToAll = eventKeys.slice(0, 6);
  const registrationBased = eventKeys.slice(6);

  return (
    <section id="events" className="events-section">
      <h2 className="section-title">EVENTS</h2>
      
      <div className="event-group">
        <h3>Open To All</h3>
        <div className="event-list">
          {openToAll.map(key => {
            const isReg = registrations.some(r => r.eventName === key);
            return (
              <button 
                key={key} 
                className="event-btn" 
                onClick={() => onOpenEventModal(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      <div className="event-group">
        <h5>REGISTRATION BASED</h5>
        <div className="event-list">
          {registrationBased.map(key => {
            return (
              <button 
                key={key} 
                className="event-btn" 
                onClick={() => onOpenEventModal(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}