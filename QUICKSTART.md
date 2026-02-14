# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1️⃣ Install Dependencies
```bash
cd beauty-ar-app
npm install
```

### 2️⃣ Get Your API Key
1. Visit: https://yce.perfectcorp.com/?affiliate=202602DevWeekHackathon
2. Sign up for free
3. Get 1,000 free API credits
4. Copy your API key

### 3️⃣ Configure API Key
Open `src/environments/environment.ts` and paste your key:
```typescript
perfectCorpApiKey: 'YOUR_KEY_HERE'
```

### 4️⃣ Start the App
```bash
npm start
```

### 5️⃣ Open in Browser
Go to: http://localhost:4200

## ✅ First Steps
1. **Allow Camera** - Grant camera permission when asked
2. **Position Face** - Center your face in view
3. **Try Products** - Tap any product at the bottom to try it!
4. **Generate AI Look** - Click AI button (bottom right) and enter a prompt

## 🎯 Testing Features

### Try Virtual Makeup
- Tap "💄 Lipstick" tab at bottom
- Swipe through colors
- Tap any color to apply instantly

### Generate AI Look
- Tap ✨ button (bottom right)
- Type: "glamorous evening look"
- Click Generate
- Click "Apply This Look"

### View Skin Analysis
- Look at top-left overlay
- Shows your skin tone, hydration, texture
- Click "Refresh" to re-analyze

## 🐛 Common Issues

**Camera won't start?**
- Make sure you're on localhost or HTTPS
- Check browser permissions
- Try Chrome or Safari

**Nothing happens when I click products?**
- Check browser console (F12)
- Make sure face is detected (green indicator)
- Try refreshing the page

**Build errors?**
```bash
rm -rf node_modules
npm install
```

## 📱 Mobile Testing

1. Get your local IP: `ifconfig` or `ipconfig`
2. Start with: `ng serve --host 0.0.0.0`
3. Open on phone: `http://YOUR_IP:4200`

(Note: Camera requires HTTPS on mobile except localhost)

## 🎬 Demo for Hackathon

**Best Demo Flow:**
1. Open app → Face detected immediately
2. Try a red lipstick → Instant AR
3. Generate "evening look" → AI magic
4. Show skin analysis → Data overlay
5. Try different products → Smooth transitions

## 💡 Pro Tips

- **Good lighting** = better face tracking
- **Center your face** for best AR results
- **Swipe quickly** through products for "wow" factor
- **Use AI generator** to show off AI integration

## 🏆 Hackathon Submission

### Requirements Checklist
- ✅ Uses Perfect Corp API
- ✅ Clear problem/solution
- ✅ Demo video (1-3 min)
- ✅ Screenshots
- ✅ Project write-up

### Video Demo Tips
- Show it working on YOUR face
- Highlight real-time AR
- Explain the problem it solves
- Keep it under 2 minutes

---

**Need Help?**
Check README.md for full documentation

**Good luck! 🚀**
