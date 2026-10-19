import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useValue, toList } from './firebase'
import { useAuth } from './AuthContext'
// รวมข้อมูล chapters / lessons / assets (แสดงเฉพาะบทเรียนที่เผยแพร่ หรือที่เป็นของผู้ใช้เอง)
export function useCatalog() {
  const { user } = useAuth()
  const c = useValue('chapters'), l = useValue('lessons'), a = useValue('assets')
  const chapters = toList(c.data).sort((x, y) => x.chapter_no - y.chapter_no)
  const lessons = toList(l.data)
    .filter((x) => x.status === 'published' || (user && x.createdBy === user.uid))
    .sort((x, y) => (x.lesson_order || 0) - (y.lesson_order || 0))
  return { chapters, lessons, assets: toList(a.data), loading: c.loading || l.loading || a.loading, error: c.error || l.error || a.error }
}
export const imgSrc = (uri) => (/^(https?:|data:)/.test(uri || '') ? uri : '/' + uri)
export function Img({ a, className, title }) {
  const [bad, setBad] = useState(false)
  if (bad) return <p className="error">โหลดรูปไม่สำเร็จ ตรวจลิงก์รูปหรืออัปโหลดไฟล์ใหม่</p>
  return <img className={className} src={imgSrc(a.uri)} alt={a.alt_text || title} loading="lazy" referrerPolicy="no-referrer" onError={() => setBad(true)} />
}
export const lessonImages = (assets, lid) => assets.filter((a) => a.lesson_id === lid && a.asset_type === 'image')
export function Status({ loading, error, empty, children }) {
  if (loading) return <p className="muted">กำลังโหลดข้อมูล…</p>
  if (error) return <p className="error">เกิดข้อผิดพลาด: {error}</p>
  if (empty) return <p className="muted">{empty}</p>
  return children
}
export function Stars({ n = 0 }) {
  const v = Math.max(0, Math.min(5, Number(n) || 0))
  return (<span className="stars" role="img" aria-label={`ระดับความยาก ${v} จาก 5`}>
    {[1, 2, 3, 4, 5].map((i) => (<svg key={i} viewBox="0 0 24 24" width="16" height="16" className={i <= v ? 'on' : ''}>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1z" /></svg>))}</span>)
}
export const Meta = ({ lesson }) => lesson.difficulty ? (
  <div className="meta"><Stars n={lesson.difficulty} /><span>ความยาก {lesson.difficulty}/5</span>
    {lesson.duration_min ? <span>· {lesson.duration_min} นาที</span> : null}</div>) : null
export function LessonCard({ lesson, chapter, assets }) {
  const img = lessonImages(assets, lesson.id)[0]
  return (
    <article className="lcard">
      {img ? <Img a={img} title={lesson.title} /> : <div className="ph">ไม่มีรูป</div>}
      <div><h3>{lesson.title}</h3><p>{lesson.description}</p><Meta lesson={lesson} />
        <small>{chapter ? `บทที่ ${chapter.chapter_no} ${chapter.title}` : ''}{' · โดย ' + (lesson.authorName || 'ทีม ComCap')}{lesson.status === 'draft' ? ' · ฉบับร่าง' : ''}</small></div>
      <Link className="btn" to={'/lessons/' + lesson.id}>เริ่มเรียน</Link>
    </article>)
}
