# ComCap CAI – เว็บสอนพื้นฐานคอมพิวเตอร์ (React + Vite + Firebase)

## ติดตั้งและใช้งาน
1. `npm install`
2. คัดลอก `.env.example` เป็น `.env` (bash: `cp .env.example .env`) แล้วใส่ค่า Firebase 5 ค่า
3. Firebase Console: เปิด Authentication (Email/Password) และ Realtime Database
4. Realtime Database → Rules: วางเนื้อหา `database.rules.json` แล้ว Publish
5. Realtime Database → Data → Import JSON: `data/comcap-firebase.json` (ที่ root; ถ้าเคย Import ไฟล์เก่าให้ลบ node เดิมก่อน)
6. `npm run dev` แล้วเปิด http://localhost:5173/

## Routes (ตาม Wireframe)
`/` หน้าแรก P01 · `/chapters` และ `/chapters/:cid` รายการบทเรียน P03 · `/lessons/:lid` รายละเอียดบทเรียน P04 · `/search?q=` ผลการค้นหา P05 · `/create` สร้างบทเรียน P06 (ต้องล็อกอิน) · `/login` P07 · `/register` P08

## โครงสร้างข้อมูล Firebase
chapters/{id} · lessons/{id} (chapter_id, title, description, sections[{heading,text,asset_id}], difficulty 1-5, duration_min, keyword, lesson_order, status; บทเรียนที่ผู้ใช้สร้างใช้ content + createdBy) · assets/{id} (chapter_id, lesson_id, uri, alt_text) · users/{uid}

## Deploy
`npm run build` → `firebase init hosting` (public = dist, SPA = yes) → `firebase deploy --only hosting`
