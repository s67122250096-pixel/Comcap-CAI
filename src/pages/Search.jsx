import { useSearchParams } from 'react-router-dom'
import { useCatalog, LessonCard, Status } from '../components'
import { SearchBox } from './Home'
export default function Search() {
  const [p] = useSearchParams()
  const q = (p.get('q') || '').trim()
  const { chapters, lessons, assets, loading, error } = useCatalog()
  const hit = q ? lessons.filter((l) => [l.title, l.description, l.keyword, l.content, (l.sections || []).map((x) => x.heading + ' ' + x.text).join(' '), chapters.find((c) => c.id === l.chapter_id)?.title]
    .some((t) => t && t.toLowerCase().includes(q.toLowerCase()))) : []
  return (<>
    <SearchBox key={q} initial={q} />
    <Status loading={loading} error={error}>
      {q ? <h2>ผลการค้นหา “{q}” ({hit.length} รายการ)</h2> : <p className="muted">พิมพ์คำที่ต้องการค้นหา</p>}
      {q && !hit.length && <p className="muted">ไม่พบบทเรียนที่ตรงกับคำค้น ลองใช้คำอื่น เช่น CPU, ซอฟต์แวร์, เครือข่าย</p>}
      <div className="list">{hit.map((l) => <LessonCard key={l.id} lesson={l} assets={assets} chapter={chapters.find((c) => c.id === l.chapter_id)} />)}</div>
    </Status></>)
}
