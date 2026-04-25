# My Blog App (Next.js 16 + Prisma 7)

A full-stack blog platform built with **Next.js 16 (App Router)**, **Prisma 7**, and **NextAuth**.

---

## 🌐 Demo

https://my-blog-sand-seven.vercel.app

---

## Repository

    https://github.com/Audywb/My-Blog.git

---

## Tech Stack

- Next.js 16 (App Router)
- Prisma 7
- PostgreSQL (NeonDB)
- NextAuth (Credentials)
- TailwindCSS
- Cloudinary (Image Upload)

---

## Installation

```bash
git clone https://github.com/Audywb/My-Blog.git
cd My-Blog
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_neondb_url
NEXTAUTH_SECRET=your_secret
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

---

## Database Setup

Run migration:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

---

## Create Admin User

Seed admin account:

```bash
npx prisma db seed
```

Admin credentials are defined in:
`prisma/seed.ts`

---

## Run Project

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔐 Authentication

- Login via `/signin`
- Admin can:
  - Create / Edit Blog
  - Publish / Unpublish
  - Approve / Reject Comments

---

## Features

### Blog
- Markdown content support
- Image upload via Cloudinary

### Comments
- User can submit comments
- Admin approval system (approve / reject)

### Admin Dashboard
- Manage blogs
- Toggle publish status
- Moderate comments

---

## Project Structure

```
app/
  blog/
  admin/
  api/
components/
lib/
prisma/
types/
```

---

## ✨ Author

Developed by Woranat Boonanke
