#!/bin/bash

echo "🎵 Genius to PowerPoint Setup Script"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Python $(python3 --version) found"
echo "✅ Node.js $(node --version) found"
echo ""

# Setup Python backend
echo "📦 Setting up Python backend..."
cd python-backend

# Create virtual environment
python3 -m venv venv
echo "✅ Virtual environment created"

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
echo "✅ Python dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp env.example .env
    echo "⚠️  Created .env file - Please add your credentials:"
    echo "   Required: GENIUS_ACCESS_TOKEN (Client Access Token)"
    echo "   Optional: GENIUS_CLIENT_ID, GENIUS_CLIENT_SECRET"
    echo "   Get them from: https://genius.com/api-clients"
else
    echo "✅ .env file already exists"
fi

cd ..

# Setup Next.js frontend
echo ""
echo "📦 Setting up Next.js frontend..."
npm install
echo "✅ Node.js dependencies installed"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    cp env.local.example .env.local
    echo "✅ Created .env.local (using default backend URL)"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Get your Genius API credentials from https://genius.com/api-clients"
echo "2. Add your Client Access Token to python-backend/.env file"
echo "3. (Optional) Add Client ID and Secret for future OAuth features"
echo "4. Run the application with:"
echo ""
echo "   Terminal 1:"
echo "   cd python-backend && source venv/bin/activate && python main.py"
echo ""
echo "   Terminal 2:"
echo "   npm run dev"
echo ""
