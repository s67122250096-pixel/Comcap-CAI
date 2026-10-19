import { Link, useParams } from 'react-router-dom'
import { useCatalog, LessonCard, Status } from '../components'
export default function Chapters() {
  const { cid } = useParams()
  const { chapters, lessons, assets, loading, error } = useCatalog()
  const ch = chapters.find((c) => c.id === cid)
  if (cid && !loading && !error && !ch) return <p>ไม่พบบทนี้ <Link to="/chapters">กลับรายการบท</Link></p>
  if (!cid) return (<>
    <h1>บทเรียนทั้งหมด</h1>
    <Status loading={loading} error={error} empty={!chapters.length && 'ยังไม่มีบทเรียน'}>
      <div className="grid">{chapters.map((c) => (
        <Link key={c.id} to={'/chapters/' + c.id} className="card ccard">
          <b>บทที่ {c.chapter_no}</b><h3>{c.title}</h3><p>{c.description}</p>
          <small>{lessons.filter((l) => l.chapter_id === c.id).length} บทเรียน</small></Link>))}</div>
    </Status></>)
  const ls = lessons.filter((l) => l.chapter_id === cid)
  return (<>
    <Link to="/chapters">← กลับไปรายการบท</Link>
    <Status loading={loading} error={error}>
      <div className="banner"><h1>บทที่ {ch?.chapter_no}: {ch?.title}</h1><p>{ch?.description}</p></div>
      <Status empty={!ls.length && 'บทนี้ยังไม่มีบทเรียน'}>
        <div className="list">{ls.map((l) => <LessonCard key={l.id} lesson={l} assets={assets} chapter={ch} />)}</div></Status>
    </Status></>)
}
