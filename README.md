# 🏎️ F1 Pit Wall Telemetry Lab

A race-engineering dashboard for comparing Formula 1 drivers, speed traces, throttle, braking, and corner deltas. The app uses the free OpenF1 API and keeps its data model ready for FastF1 session exports.

## ✨ Features

- 📡 Live season and session picker from OpenF1
- 🧑‍✈️ Driver selection with numbers, team colours, and headshots when supplied by the feed
- 📈 Speed, throttle, brake, and delta charts powered by Plotly
- 🎯 Corner-by-corner advantage detection
- ⚡ Local response caching to make repeated analysis faster
- 📱 Responsive pit-wall layout for desktop and mobile

## 🚦 Quick Start

### Requirements

- Node.js 14 or newer
- npm
- Internet access for OpenF1 data and driver photos

```bash
npm install
npm start
```

Open **http://localhost:3000** in your browser, choose a season, select a session, then choose two cars.

## 🔌 API

- `GET /api/sessions/:year` - Race sessions for a season
- `GET /api/drivers/:sessionKey` - Drivers, teams, numbers, and headshots
- `GET /api/compare/:sessionKey/:driver1/:driver2` - Normalized car-data comparison
- `GET /api/test` - Server health check

## 🧪 Data Sources

The live Node.js path uses [OpenF1](https://openf1.org), which requires no API key. The comparison pipeline consumes the same core fields used by FastF1 (`speed`, `throttle`, `brake`, `gear`, and normalized distance), so FastF1 CSV or Python-exported session data can be added without changing the dashboard contract.

## 🛠️ Stack

Express.js · Axios · OpenF1 · Plotly.js · Node.js

Made with 🏁 for people who read lap traces for fun.
