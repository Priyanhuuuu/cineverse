# 🎬 Cineverse

A Hotstar-style streaming platform — Movies, Web Shows, Serials, Live Sports.

## 🚀 Deploy on Vercel (Step by Step)

### Step 1 — Push to GitHub

```bash
# Open terminal in the cineverse folder, then run:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cineverse.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to **https://vercel.com** and sign in with GitHub
2. Click **"Add New Project"**
3. Import your **cineverse** repo
4. Vercel auto-detects Create React App — just click **"Deploy"**
5. Done! Your live URL will be: `https://cineverse-xxx.vercel.app`

> No extra settings needed. `vercel.json` handles everything.

---

## 💻 Run Locally

```bash
npm install
npm start
# Opens http://localhost:3000
```

## 🏗️ Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
cineverse/
├── public/
│   └── index.html
├── src/
│   ├── App.js          ← All components + main logic
│   ├── index.js        ← Entry point
│   ├── index.css       ← All styles
│   └── data.js         ← API helpers & static data
├── vercel.json         ← Vercel config
├── package.json
└── README.md
```

## ✨ Features

- 🏠 Home, 🎬 Movies, 🎭 Web Shows, 📺 Serials, 🏆 Sports, 🔖 Watchlist
- Sign In / Register with plan selection
- 3D card hover animations
- Live search with suggestions
- Hero auto-play slider
- Particle background
- Fully responsive
