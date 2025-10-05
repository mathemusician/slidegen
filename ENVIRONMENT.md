# Environment Configuration Guide

This document explains all environment variables used in the application.

## Python Backend Environment Variables

**File**: `python-backend/.env`

### Required Variables

#### `GENIUS_ACCESS_TOKEN`
- **Purpose**: Authenticate with Genius API to fetch lyrics
- **Source**: https://genius.com/api-clients
- **How to get**:
  1. Go to https://genius.com/api-clients
  2. Click "New API Client"
  3. Fill in the form and save
  4. Copy the **"Client Access Token"** (NOT Client ID or Secret)
- **Example**: `GENIUS_ACCESS_TOKEN=abc123xyz789...`
- **Required**: Yes

### Optional Variables

#### `GENIUS_CLIENT_ID`
- **Purpose**: OAuth client ID (for future features)
- **Source**: Same page as access token
- **Required**: No (reserved for future OAuth implementation)
- **Example**: `GENIUS_CLIENT_ID=abc123`

#### `GENIUS_CLIENT_SECRET`
- **Purpose**: OAuth client secret (for future features)
- **Source**: Same page as access token
- **Required**: No (reserved for future OAuth implementation)
- **Example**: `GENIUS_CLIENT_SECRET=xyz789`
- **Security**: Keep this secret! Never commit to version control

## Next.js Frontend Environment Variables

**File**: `.env.local` (root directory)

### Optional Variables

#### `PYTHON_BACKEND_URL`
- **Purpose**: URL of the Python backend API
- **Default**: `http://localhost:8000`
- **Development**: `http://localhost:8000`
- **Production**: `https://your-backend.railway.app` (or your deployed URL)
- **Example**: `PYTHON_BACKEND_URL=http://localhost:8000`
- **Required**: No (defaults to localhost:8000)

## Environment File Setup

### Development Setup

1. **Python Backend**:
   ```bash
   cd python-backend
   cp env.example .env
   # Edit .env and add your GENIUS_ACCESS_TOKEN
   ```

2. **Next.js Frontend** (optional):
   ```bash
   cp env.local.example .env.local
   # Edit .env.local if you need to change the backend URL
   ```

### Production Setup

#### Backend (Railway/Render/Fly.io)

Set environment variables in your hosting platform:
- `GENIUS_ACCESS_TOKEN`: Your Genius API token
- `GENIUS_CLIENT_ID`: (optional)
- `GENIUS_CLIENT_SECRET`: (optional)

#### Frontend (Vercel)

Set environment variable:
- `PYTHON_BACKEND_URL`: Your deployed backend URL (e.g., `https://your-app.railway.app`)

## Security Best Practices

1. **Never commit `.env` files** to version control
   - Already configured in `.gitignore`

2. **Use different tokens for development and production**
   - Create separate API clients on Genius

3. **Rotate tokens periodically**
   - Generate new tokens every few months

4. **Keep Client Secret secure**
   - Only needed for OAuth (not currently used)
   - Never expose in client-side code

## Troubleshooting

### "GENIUS_ACCESS_TOKEN not set"
- Check that `python-backend/.env` exists
- Verify the token is on the correct line
- Make sure there are no extra spaces or quotes
- Restart the Python backend after editing

### "Connection refused" from Next.js
- Check `PYTHON_BACKEND_URL` in `.env.local`
- Verify Python backend is running on the specified port
- Test backend: `curl http://localhost:8000`

### "Invalid token" errors
- Verify you copied the **Client Access Token** (not Client ID)
- Check token hasn't expired
- Regenerate token on Genius if needed

## Example Configuration Files

### `python-backend/.env`
```bash
GENIUS_ACCESS_TOKEN=your_actual_token_here_abc123xyz789
GENIUS_CLIENT_ID=optional_client_id
GENIUS_CLIENT_SECRET=optional_client_secret
```

### `.env.local` (Next.js)
```bash
PYTHON_BACKEND_URL=http://localhost:8000
```

## References

- **Genius API Documentation**: https://docs.genius.com/
- **lyricsgenius Library**: https://github.com/johnwmillr/LyricsGenius
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables
- **FastAPI Configuration**: https://fastapi.tiangolo.com/advanced/settings/
