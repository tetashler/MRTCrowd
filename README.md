# MRTLeh - Singapore MRT Companion

A mobile-first web app for real-time Singapore MRT crowd levels and service alerts.

## Features

- Real-time train service disruption alerts
- Live crowd level data for all MRT stations
- Save up to 5 favourite stations
- Auto-refresh every 60 seconds
- Dark theme optimized for mobile

## Running the Application

### 1. Install dependencies
```bash
npm install
```

### 2. Start the proxy server (in one terminal)
```bash
npm run proxy
```

### 3. Start the dev server (in another terminal)
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Express (proxy server)
- LTA DataMall API
