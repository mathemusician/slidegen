# Quick Start Guide

## 5-Minute Setup

### Step 1: Get Genius API Credentials (2 minutes)

1. Visit https://genius.com/api-clients
2. Click "New API Client"
3. Fill in the form:
   - **App Name**: "My Lyrics App" (or any name)
   - **App Website URL**: http://localhost:3000
   - **Redirect URI**: http://localhost:3000/callback
4. Click "Save"
5. Copy your credentials:
   - **Client Access Token** (required - this is the main one you need)
   - **Client ID** (optional - save for future use)
   - **Client Secret** (optional - save for future use)

### Step 2: Run Setup Script (2 minutes)

```bash
./setup.sh
```

This will:
- Create Python virtual environment
- Install all dependencies
- Create `.env` file

### Step 3: Add Your API Credentials (30 seconds)

Edit `python-backend/.env`:
```bash
# Required - paste your Client Access Token
GENIUS_ACCESS_TOKEN=your_client_access_token_here

# Optional - for future OAuth features
GENIUS_CLIENT_ID=your_client_id_here
GENIUS_CLIENT_SECRET=your_client_secret_here
```

**Note**: You only need the `GENIUS_ACCESS_TOKEN` for the app to work. The Client ID and Secret are optional and reserved for future OAuth implementation.

### Step 4: Start the Application (30 seconds)

**Terminal 1 - Python Backend:**
```bash
cd python-backend
source venv/bin/activate
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Next.js Frontend:**
```bash
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

### Step 5: Test It!

1. Open http://localhost:3000 (or 3001 if 3000 is taken)
2. Paste a Genius URL, for example:
   - https://genius.com/Ed-sheeran-perfect-lyrics
   - https://genius.com/Taylor-swift-shake-it-off-lyrics
3. Click "Generate PowerPoint"
4. Download your presentation!

## Troubleshooting

### "GENIUS_ACCESS_TOKEN not set"
- Make sure you created `python-backend/.env` file
- Make sure you added your token to the file
- Restart the Python backend

### "Connection refused" or "Network error"
- Make sure Python backend is running on port 8000
- Check: `curl http://localhost:8000` should return JSON

### "Song not found"
- Make sure the URL is from genius.com
- Try a different song URL
- Check that your API token is valid

### Port 3000 already in use
- Next.js will automatically use port 3001
- Or stop the other app using port 3000

## Testing the Python Backend

Test the backend directly:
```bash
curl -X POST http://localhost:8000/api/lyrics \
  -H "Content-Type: application/json" \
  -d '{"url": "https://genius.com/Ed-sheeran-perfect-lyrics"}'
```

Should return JSON with title, artist, and lyrics.
