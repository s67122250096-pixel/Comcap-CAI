import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useAuth } from './AuthContext'
import Home from './pages/Home'
import Chapters from './pages/Chapters'
import Lesson from './pages/Lesson'
import Search from './pages/Search'
import Create from './pages/Create'
import { Login, Register } from './pages/Auth'
export default function App() {
  const { user, profile, ready } = useAuth()
  if (!ready) return <p className="center">กำลังโหลด…</p>
  return (<>
    <header className="top">
      <Link to="/" className="brand"><img src="/assets/logo/comcap_logo.png" alt="" />ComCap CAI</Link>
      <nav className="nav">
        <NavLink to="/" end>หน้าแรก</NavLink><NavLink to="/chapters">บทเรียน</NavLink>
        <NavLink to="/search">ค้นหา</NavLink><NavLink to="/create">สร้างบทเรียน</NavLink>
      </nav>
      <div className="acct">{user
        ? <><span>{profile?.name || user.email}</span><button className="ghost" onClick={() => signOut(auth)}>ออกจากระบบ</button></>
        : <><Link to="/login">เข้าสู่ระบบ</Link><Link to="/register" className="btn">สมัครสมาชิก</Link></>}</div>
    </header>
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/chapters/:cid" element={<Chapters />} />
        <Route path="/lessons/:lid" element={<Lesson />} />
        <Route path="/search" element={<Search />} />
        <Route path="/create" element={user ? <Create /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="*" element={<p>ไม่พบหน้านี้ <Link to="/">กลับหน้าแรก</Link></p>} />
      </Routes>
    </main></>)
}
