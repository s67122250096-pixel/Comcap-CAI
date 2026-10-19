import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, onValue } from 'firebase/database'
import { useEffect, useState } from 'react'
const env = import.meta.env
const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY, authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL, projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID }
// ค่าที่ขาดใน .env (แสดงบนหน้าจอแทนหน้าขาว)
export const missing = Object.entries(cfg).filter(([, v]) => !v).map(([k]) => ({ apiKey: 'VITE_FIREBASE_API_KEY', authDomain: 'VITE_FIREBASE_AUTH_DOMAIN', databaseURL: 'VITE_FIREBASE_DATABASE_URL', projectId: 'VITE_FIREBASE_PROJECT_ID', appId: 'VITE_FIREBASE_APP_ID' }[k]))
export let initError = ''
let auth = null, db = null
try {
  if (!missing.length) { const app = initializeApp(cfg); auth = getAuth(app); db = getDatabase(app) }
} catch (e) { initError = e.message }
export { auth, db }
// hook อ่านข้อมูลแบบ realtime พร้อมสถานะ loading / error
export function useValue(path) {
  const [s, setS] = useState({ data: null, loading: true, error: null })
  useEffect(() => {
    if (!path) return
    setS({ data: null, loading: true, error: null })
    return onValue(ref(db, path),
      (snap) => setS({ data: snap.val(), loading: false, error: null }),
      (err) => setS({ data: null, loading: false, error: err.message }))
  }, [path])
  return s
}
export const toList = (o) => Object.entries(o || {}).map(([id, v]) => ({ id, ...v }))
