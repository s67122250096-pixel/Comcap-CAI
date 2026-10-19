import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCatalog, LessonCard, Status } from '../components'
export function SearchBox({ initial = '' }) {
  const [q, setQ] = useState(initial), nav = useNavigate()
  return (<form className="searchbox" onSubmit={(e) => { e.preventDefault(); nav('/search?q=' + encodeURIComponent(q.trim())) }}>
    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาบทเรียน เช่น RAM, CPU, เครือข่าย" aria-label="ค้นหา" />
    <button>ค้นหา</button></form>)
}
export default function Home() {
  const { chapters, lessons, assets, loading, error } = useCatalog()
  return (<>
    <SearchBox />
    <section className="hero"><div><h1>เรียนรู้คอมพิวเตอร์กับ ComCap CAI</h1>
      <p>บทเรียนพื้นฐานคอมพิวเตอร์ ฮาร์ดแวร์ ซอฟต์แวร์ และเครือข่าย พร้อมภาพประกอบ เรียนได้ทุกที่ และสมาชิกเพิ่มบทเรียนของตัวเองได้</p>
      <Link className="btn" to="/chapters">เริ่มเรียนเลย</Link></div>
      <img src="/assets/logo/comcap_logo.png" alt="โลโก้ ComCap" /></section>
    <h2>บทเรียน {chapters.length} บท</h2>
    <Status loading={loading} error={error} empty={!chapters.length && 'ยังไม่มีบทเรียน'}>
      <div className="grid">{chapters.map((c) => (
        <Link key={c.id} to={'/chapters/' + c.id} className="card ccard">
          <b>บทที่ {c.chapter_no}</b><h3>{c.title}</h3><small>{c.description}</small></Link>))}</div>
      <h2>บทเรียนแนะนำ</h2>
      <div className="list">{lessons.slice(0, 4).map((l) => (
        <LessonCard key={l.id} lesson={l} assets={assets} chapter={chapters.find((c) => c.id === l.chapter_id)} />))}</div>
    </Status></>)
}
