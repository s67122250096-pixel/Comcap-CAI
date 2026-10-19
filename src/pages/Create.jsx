import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ref, push, set, update, remove } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../AuthContext'
import { useCatalog, Status } from '../components'
const empty = { title: '', chapter_id: 'ch06', description: '', content: '', keyword: '', image_url: '', difficulty: '1', duration_min: '10' }
export default function Create() {
  const { user, profile } = useAuth()
  const { chapters, lessons, assets, loading, error } = useCatalog()
  const [imgData, setImgData] = useState(''), [f, setF] = useState(empty), [err, setErr] = useState(''), [ok, setOk] = useState('')
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  function pick(e) {
    const file = e.target.files[0]; setErr(''); setImgData('')
    if (!file) return
    if (!file.type.startsWith('image/')) return setErr('กรุณาเลือกไฟล์รูปภาพ')
    if (file.size > 8 * 1024 * 1024) return setErr('ไฟล์ใหญ่เกิน 8 MB')
    const url = URL.createObjectURL(file), im = new Image()
    im.onload = () => {
      const k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement('canvas')
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k)
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
      setImgData(c.toDataURL('image/jpeg', 0.75)); URL.revokeObjectURL(url)
    }
    im.onerror = () => setErr('อ่านไฟล์รูปไม่ได้')
    im.src = url
  }
  const canLoad = (u) => new Promise((ok) => { const i = new Image(); i.referrerPolicy = 'no-referrer'
    i.onload = () => ok(true); i.onerror = () => ok(false); setTimeout(() => ok(false), 8000); i.src = u })
  async function save(status) {
    setErr(''); setOk('')
    if (!f.title.trim()) return setErr('กรุณากรอกชื่อบทเรียน')
    if (!f.chapter_id) return setErr('กรุณาเลือกบท')
    if (!f.content.trim()) return setErr('กรุณากรอกเนื้อหาบทเรียน')
    if (!imgData && f.image_url && !/^https?:\/\//.test(f.image_url)) return setErr('ลิงก์รูปต้องขึ้นต้นด้วย http:// หรือ https://')
    if (!imgData && f.image_url && !(await canLoad(f.image_url.trim()))) return setErr('ลิงก์นี้เปิดเป็นรูปไม่ได้ ต้องเป็นลิงก์ตรงของไฟล์รูป หรือใช้ปุ่มอัปโหลดไฟล์แทน')
    const r = push(ref(db, 'lessons'))
    const n = lessons.filter((l) => l.chapter_id === f.chapter_id).length + 1
    try {
      await set(r, { chapter_id: f.chapter_id, title: f.title.trim(), description: f.description.trim(), content: f.content.trim(),
        keyword: f.keyword.trim(), difficulty: Number(f.difficulty), duration_min: Number(f.duration_min) || 10, lesson_order: n, status, createdBy: user.uid, authorName: profile?.name || user.email, createdAt: Date.now() })
      if (imgData || f.image_url) await set(push(ref(db, 'assets')), { chapter_id: f.chapter_id, lesson_id: r.key, asset_type: 'image',
        uri: imgData || f.image_url.trim(), alt_text: f.title.trim(), createdBy: user.uid })
      setF(empty); setImgData(''); setOk(status === 'published' ? 'เผยแพร่บทเรียนแล้ว' : 'บันทึกฉบับร่างแล้ว')
    } catch (x) { setErr('บันทึกไม่สำเร็จ: ' + x.message) }
  }
  const mine = lessons.filter((l) => l.createdBy === user.uid)
  const del = async (l) => {
    if (!confirm('ลบบทเรียน "' + l.title + '" ?')) return
    await Promise.all(assets.filter((a) => a.lesson_id === l.id && a.createdBy === user.uid).map((a) => remove(ref(db, 'assets/' + a.id))))
    await remove(ref(db, 'lessons/' + l.id))
  }
  return (<>
    <h1>สร้างบทเรียน</h1>
    <p className="muted">บทเรียนที่คุณสร้างจะอยู่ในบท “บทเรียนจากสมาชิก” และแสดงชื่อของคุณเป็นผู้สร้าง</p>
    <Status loading={loading} error={error}>
      <div className="card">
        <label>ชื่อบทเรียน<input value={f.title} onChange={on('title')} /></label>
        <div className="row"><label>ระดับความยาก<select value={f.difficulty} onChange={on('difficulty')}>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>)}</select></label>
          <label>เวลาเรียน (นาที)<input type="number" min="1" value={f.duration_min} onChange={on('duration_min')} /></label></div>
        <label>คำอธิบายสั้น<input value={f.description} onChange={on('description')} /></label>
        <label>เนื้อหาบทเรียน (ขึ้นต้นบรรทัดด้วย ## เพื่อทำหัวข้อย่อย)<textarea rows="8" value={f.content} onChange={on('content')} /></label>
        <label>คำค้น (คั่นด้วยเครื่องหมายจุลภาค)<input value={f.keyword} onChange={on('keyword')} placeholder="cpu, ram" /></label>
        <label>อัปโหลดรูปประกอบ (ถ้ามี)<input type="file" accept="image/*" onChange={pick} /></label>
        {imgData && <img src={imgData} alt="ตัวอย่างรูป" style={{ maxWidth: 240, borderRadius: 8 }} />}
        <label>หรือใส่ลิงก์รูป (ต้องเป็นลิงก์ตรงของไฟล์รูป)<input value={f.image_url} onChange={on('image_url')} placeholder="https://..." /></label>
        {err && <p className="error">{err}</p>}{ok && <p className="notice">{ok}</p>}
        <div className="row"><button className="ghost" onClick={() => save('draft')}>บันทึกฉบับร่าง</button>
          <button onClick={() => save('published')}>เผยแพร่</button></div></div>
      <h2>บทเรียนของฉัน</h2>
      {!mine.length && <p className="muted">ยังไม่มีบทเรียนที่คุณสร้าง</p>}
      {mine.map((l) => <div className="card row between" key={l.id}>
        <span><Link to={'/lessons/' + l.id}>{l.title}</Link> <small>({l.status === 'published' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'})</small></span>
        <span><button className="ghost" onClick={() => update(ref(db, 'lessons/' + l.id), { status: l.status === 'published' ? 'draft' : 'published' })}>
          {l.status === 'published' ? 'ยกเลิกเผยแพร่' : 'เผยแพร่'}</button>
          <button className="ghost" onClick={() => del(l)}>ลบ</button></span></div>)}
    </Status></>)
}
