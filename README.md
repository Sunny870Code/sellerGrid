# SellerGrid — Ecommerce Review Intelligence Dashboard

A full-stack solution for Ecommerce Brand Owners to monitor and manage thousands of reviews across multiple online platforms (Amazon, Flipkart, Meesho, Myntra, Nykaa).

---

## Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios, Recharts |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas                     |
| File Upload | Multer                          |

---

## Project Structure

```
sellergrid/
├── client/     → React frontend
└── server/     → Node.js + Express backend
```

---

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install

# Copy env file and fill in your MongoDB Atlas URI
cp .env.example .env
# Edit .env: add your MONGODB_URI

npm run dev   # starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev   # starts on http://localhost:5173
```

> **Note:** The frontend works in **Demo Mode** even without the backend connected — it uses mock data so you can see all UI features immediately.

---

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/reviews              | Get all reviews (filterable) |
| GET    | /api/reviews/stats        | Get dashboard stats      |
| POST   | /api/reviews              | Add new review (+ file upload) |
| PATCH  | /api/reviews/:id/toggle   | Toggle resolved status   |
| DELETE | /api/reviews/:id          | Delete a review          |

### Query Params for GET /api/reviews
- `platform` — Amazon | Flipkart | Meesho | Myntra | Nykaa | Other
- `sentiment` — Positive | Negative | Neutral
- `rating` — 1 to 5
- `isResolved` — true | false
- `search` — text search across product, reviewer, review text

---

## Features

- 📊 Live dashboard with sentiment & platform charts
- 🔍 Search & filter reviews by platform, sentiment, rating
- ✅ Mark reviews as resolved / unresolved
- ➕ Add new reviews with optional file attachment (Multer)
- 🗑️ Delete reviews
- 📱 Responsive design
- 🌙 Dark theme with glassmorphism UI

---

## Submission

Per the assignment instructions:
1. Build is uploaded to Google Drive and shared with vinit@sellergrid.in
2. ChatGPT conversation link is included in the form

---

## MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Paste it in `server/.env` as `MONGODB_URI`
