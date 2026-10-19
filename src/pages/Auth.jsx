import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../firebase'
const MSG = { 'auth/email-already-in-use': 'อีเมลนี้ถูกใช้สมัครแล้ว', 'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง', 'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'auth/configuration-not-found': 'ยังไม่ได้เปิด Authentication ใน Firebase' }
function Form({ register }) {
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', agree: false })
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const on = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  async function submit(e) {
    e.preventDefault(); setErr('')
    if (register) {
      if (!f.name.trim()) return setErr('กรุณากรอกชื่อ-นามสกุล')
      if (f.password.length < 6) return setErr('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      if (f.password !== f.confirm) return setErr('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน')
      if (!f.agree) return setErr('กรุณายอมรับเงื่อนไขการใช้งาน')
    }
    setBusy(true)
    try {
      if (register) {
        const c = await createUserWithEmailAndPassword(auth, f.email, f.password)
        await set(ref(db, 'users/' + c.user.uid), { name: f.name.trim(), email: f.email, createdAt: Date.now() })
      } else await signInWithEmailAndPassword(auth, f.email, f.password)
    } catch (x) { setErr(MSG[x.code] || 'ไม่สำเร็จ: ' + x.code) }
    setBusy(false)
  }
  return (<form className="card narrow" onSubmit={submit}>
    <h1>{register ? 'สมัครสมาชิก ComCap CAI' : 'เข้าสู่ระบบ'}</h1>
    {register && <label>ชื่อ-นามสกุล<input value={f.name} onChange={on('name')} /></label>}
    <label>อีเมล<input type="email" required value={f.email} onChange={on('email')} /></label>
    <label>รหัสผ่าน<input type="password" required value={f.password} onChange={on('password')} /></label>
    {register && <><label>ยืนยันรหัสผ่าน<input type="password" required value={f.confirm} onChange={on('confirm')} /></label>
      <label className="chk"><input type="checkbox" checked={f.agree} onChange={on('agree')} /> ยอมรับเงื่อนไขการใช้งาน</label></>}
    {err && <p className="error">{err}</p>}
    <button disabled={busy}>{register ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</button>
    <p>{register ? <>มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link></> : <>ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link></>}</p>
  </form>)
}
export const Login = () => <Form />
export const Register = () => <Form register />
