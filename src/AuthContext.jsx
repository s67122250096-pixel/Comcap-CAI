import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, onValue } from 'firebase/database'
import { auth, db } from './firebase'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [ready, setReady] = useState(false)
  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u); if (!u) { setProfile(null); setReady(true) }
  }), [])
  useEffect(() => {
    if (!user) return
    return onValue(ref(db, 'users/' + user.uid), (s) => { setProfile(s.val()); setReady(true) })
  }, [user])
  return <Ctx.Provider value={{ user, profile, ready }}>{children}</Ctx.Provider>
}
