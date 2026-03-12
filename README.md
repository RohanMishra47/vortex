# ⚡ Vortex - Lightning-Fast URL Shortener

A high-performance, geographically distributed URL shortener built with Next.js, featuring sub-50ms redirects and real-time analytics.

![Vortex Dashboard](public\Dashboard1.png)
![Vortex Dashboard](public\Dashboard2.png)

## 🌟 Features

### ⚡ Edge-Powered Redirection

- **Sub-50ms response times** globally using Vercel Edge Functions
- Redirects execute at the nearest data center to each user
- No central server bottleneck

### 📊 Real-Time Analytics

- Click tracking with geographic data
- Device and browser breakdown
- Traffic source analysis
- Live dashboard with auto-refresh

### 🔒 Smart Bot Filtering

- Automatically filters bot traffic using `isbot`
- Keeps analytics accurate and meaningful

### 🎨 Beautiful UI

- Modern glassmorphism design
- Responsive layout for all devices
- Real-time data updates with SWR
- Toast notifications for all actions

### 🚀 Performance Optimized

- Cache-first architecture with Redis
- Asynchronous analytics processing
- Edge runtime for global speed
- Optimistic UI updates

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Clicks Link                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Vercel Edge Function (Nearest Region)           │
│                   - Check Redis Cache                        │
│                   - Fallback to PostgreSQL                   │
│                   - Queue Analytics (Non-Blocking)           │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
        ┌──────────────────┐   ┌──────────────────┐
        │  Instant Redirect │   │ Background Queue  │
        │    (<50ms)        │   │  (1-2 seconds)    │
        └──────────────────┘   └──────────────────┘
                                        ↓
                              ┌──────────────────┐
                              │ PostgreSQL Save  │
                              │  Click Analytics │
                              └──────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** (App Router)
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **SWR** for data fetching
- **Sonner** for toast notifications
- **Lucide React** for icons

### Backend

- **Next.js API Routes** (serverless)
- **Vercel Edge Functions** (for redirects)
- **Prisma ORM** (database queries)
- **Upstash Redis** (distributed caching)
- **Upstash QStash** (message queue)

### Database & Infrastructure

- **PostgreSQL** (Neon/Supabase)
- **Redis** (Upstash)
- **Vercel** (deployment & CDN)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (local or cloud)
- Upstash Redis account
- Upstash QStash account (optional, for analytics)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/RohanMishra47/vortex.git
cd vortex
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database (Neon, Supabase, or local PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/vortex"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://your-region.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"

# Upstash QStash (optional - for async analytics)
QSTASH_URL="https://qstash.upstash.io"
QSTASH_TOKEN="your-qstash-token"
QSTASH_CURRENT_SIGNING_KEY="your-signing-key"
QSTASH_NEXT_SIGNING_KEY="your-next-signing-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Run database migrations**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Start the development server**

```bash
npm run dev
```

6. **Open your browser**

```
http://localhost:3000
```

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/vortex.git
git push -u origin main
```

2. **Connect to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables (same as `.env.local`)
- Deploy!

3. **Update `NEXT_PUBLIC_APP_URL`**
   After deployment, update this variable to your Vercel URL:

```
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

---

## 📊 Database Schema

### Links Table

```prisma
model Link {
  id        Int      @id @default(autoincrement())
  shortCode String   @unique
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  clicks    Click[]
}
```

### Clicks Table

```prisma
model Click {
  id        Int      @id @default(autoincrement())
  shortCode String
  clickedAt DateTime @default(now())
  country   String?
  city      String?
  device    String?
  browser   String?
  os        String?
  referrer  String?
  ipHash    String?
  link      Link     @relation(...)
}
```

---

## 🔒 Security Features

- **IP Hashing**: Raw IP addresses are hashed (SHA-256) before storage
- **Bot Filtering**: Automatic bot detection using `isbot` library
- **Edge Security**: Runs on Vercel's secure edge network
- **Environment Variables**: Sensitive data never committed to Git

---

## 📈 Performance Benchmarks

| Metric                       | Performance              |
| ---------------------------- | ------------------------ |
| **Redirect Time (cached)**   | 10-50ms                  |
| **Redirect Time (uncached)** | 100-200ms                |
| **Analytics Processing**     | 1-2 seconds (background) |
| **Dashboard Load Time**      | < 2 seconds              |
| **Global Availability**      | 99.9% uptime             |

---

## 🎯 API Reference

### Create Short Link

```bash
POST /api/links
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

**Response:**

```json
{
  "shortCode": "a7B9xQ2",
  "shortUrl": "https://vortex.app/a7B9xQ2",
  "url": "https://example.com/very/long/url",
  "createdAt": "2025-02-08T10:30:00Z"
}
```

### Get All Links

```bash
GET /api/links
```

### Get Analytics

```bash
GET /api/analytics/[shortCode]
```

### Delete Link

```bash
DELETE /api/links/[shortCode]
```

---

## 🧪 Testing

```bash

# Build for production
npm run build

# Test production build locally
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the need for faster, more transparent URL shorteners
- Thanks to the Next.js, Vercel, and Upstash teams for amazing tools

---

## 📧 Contact

- 💼 LinkedIn: [Rohan Mishra](https://www.linkedin.com/in/rohan-mishra-6391bb372/)
- 🐙 GitHub: [RohanMishra47](https://github.com/RohanMishra47)
- 𝕏 (Twitter): [@RohanMishr19102](https://x.com/RohanMishr19102)
- 📧 Email: mydearluffy093@gmail.com

---

## 🗺️ Roadmap

- [ ] Custom domains support
- [ ] A/B testing for links
- [ ] Geofencing (redirect based on location)
- [ ] QR code generation
- [ ] Link expiration dates
- [ ] Password-protected links
- [ ] Rate limiting per IP
- [ ] Public API with authentication

---

**Built with ❤️ and ⚡ by Rohan Mishra**
