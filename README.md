# SAMEBI Lebensbalance-Check Dashboard

Professional dashboard for counselors and supervisors to manage and analyze addiction screening results.

## 🎯 Features

- **Counselor Dashboard**: Manage clients, view test results, track progress
- **Supervisor Dashboard**: Global analytics, counselor management, system-wide insights
- **Real-time Analytics**: Live tracking of test completions and abandonment points
- **Mobile Optimized**: Responsive design for desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend API**: Node.js + Express + PostgreSQL

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🌍 Environment Variables

```bash
VITE_API_URL=https://api-check.samebi.net/api
VITE_APP_NAME=SAMEBI Dashboard
VITE_DOMAIN=dashboard.samebi.net
VITE_LANGUAGE=de
```

## 🔐 Demo Credentials

### Counselor Login
- **Email**: `berater@samebi.net`
- **Password**: `Demo2025!`

### Supervisor Login
- **Email**: `supervisor@samebi.net`
- **Password**: `Supervisor2025!`

## 🐳 Docker Deployment

```bash
# Build image
docker build -t samebi-dashboard .

# Run container
docker run -p 80:80 \
  -e VITE_API_URL=https://api-check.samebi.net/api \
  samebi-dashboard
```

## 📖 Documentation

For detailed documentation, see the main project documentation in `/input/docs/`.

## 🔗 Related Projects

- **Public Test App**: `tool-sucht-indentifizieren-anonym/`
- **Backend API**: `tool-sucht-indentifizieren-anonym/backend/`

## 📝 License

Proprietary - SAMEBI Tools © 2025
