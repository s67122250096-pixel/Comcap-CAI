import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { missing, initError } from './firebase.js'
import ErrorBoundary from './ErrorBoundary.jsx'
import App from './App.jsx'
import { AuthProvider } from './AuthContext.jsx'
import './index.css'
const root = ReactDOM.createRoot(document.getElementById('root'))
if (missing.length || initError) {
  root.render(<div style={{ padding: 20, fontFamily: 'sans-serif' }}>
    <h2>ตั้งค่า Firebase ไม่สมบูรณ์</h2>
    {missing.length > 0 && <><p>ไฟล์ .env ขาดค่าเหล่านี้ (หรือยังไม่ได้รัน npm run dev ใหม่หลังแก้ไฟล์):</p>
      <ul>{missing.map((m) => <li key={m}>{m}</li>)}</ul></>}
    {initError && <p>ข้อผิดพลาด: {initError}</p>}</div>)
} else {
  root.render(<ErrorBoundary><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></ErrorBoundary>)
}
