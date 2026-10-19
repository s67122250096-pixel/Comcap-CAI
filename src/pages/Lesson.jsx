import { Link, useParams } from 'react-router-dom'
import { useCatalog, lessonImages, Img, Meta, Status } from '../components'
export default function Lesson() {
  const { lid } = useParams()
  const { chapters, lessons, assets, loading, error } = useCatalog()
  const l = lessons.find((x) => x.id === lid)
  const ch = chapters.find((c) => c.id === l?.chapter_id)
  const sib = lessons.filter((x) => x.chapter_id === l?.chapter_id)
  const i = sib.findIndex((x) => x.id === lid)
  const Pic = ({ a }) => a && (<figure><Img a={a} className="pic" title={l.title} />
    {a.caption && <figcaption>{a.caption}</figcaption>}</figure>)
  return (<Status loading={loading} error={error} empty={!l && <>ไม่พบบทเรียนนี้ <Link to="/chapters">กลับรายการบทเรียน</Link></>}>
    {l && <>
      <Link to={'/chapters/' + l.chapter_id}>← กลับไปรายการบทเรียน</Link>
      <div className="lesson">
        <aside className="card"><b>บทเรียนในบทนี้</b>
          {sib.map((s) => <Link key={s.id} to={'/lessons/' + s.id} className={s.id === lid ? 'cur' : ''}>{s.title}</Link>)}</aside>
        <article className="card">
          <small>บทที่ {ch?.chapter_no} {ch?.title}</small>
          <h1>{l.title}</h1><p className="muted">{l.description}</p><Meta lesson={l} /><small>ผู้สร้าง: {l.authorName || 'ทีม ComCap'}</small>
          {l.sections ? l.sections.map((s, k) => (
            <section key={k}><h2>{s.heading}</h2><p className="body">{s.text}</p>
              <Pic a={assets.find((a) => a.id === s.asset_id)} /></section>))
            : <>{(l.content || '').split(/\n(?=## )/).map((b, k) => { const m = b.match(/^## (.*)\n?([\s\S]*)/); return m ? <section key={k}><h2>{m[1]}</h2><p className="body">{m[2]}</p></section> : <p key={k} className="body">{b}</p> })}{lessonImages(assets, lid).map((a) => <Pic key={a.id} a={a} />)}</>}
          <div className="row">{sib[i - 1] && <Link className="btn" to={'/lessons/' + sib[i - 1].id}>← ก่อนหน้า</Link>}
            {sib[i + 1] && <Link className="btn" to={'/lessons/' + sib[i + 1].id}>ถัดไป →</Link>}</div>
        </article></div></>}
  </Status>)
}
