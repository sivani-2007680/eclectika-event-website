import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This wrapper is required so Google OAuth hooks can be used inside App.jsx */}
    <GoogleOAuthProvider clientId="788399363670-ulumsmi86tj3rf8ic8v4q1ctbh84g067.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)