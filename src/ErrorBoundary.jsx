import { Component } from 'react'
export default class ErrorBoundary extends Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  render() {
    if (!this.state.err) return this.props.children
    return (<div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>เกิดข้อผิดพลาดในหน้าเว็บ</h2><p>ส่งข้อความด้านล่างนี้ให้ผู้ช่วยเพื่อแก้ไข</p>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#fee', padding: 12 }}>{String(this.state.err.stack || this.state.err)}</pre></div>)
  }
}
