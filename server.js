/**
 * F1 Pit Wall Dashboard Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const F1DataFetcher = require('./src/data/dataFetcher');
const TelemetryAnalyzer = require('./src/analysis/telemetryAnalyzer');
const DashboardService = require('./src/dashboard/dashboardService');
const { normalizeSessions, normalizeDrivers } = require('./src/utils/dataUtils');

const app = express();
const port = Number(process.env.PORT || 3000);
const fetcher = new F1DataFetcher();
const analyzer = new TelemetryAnalyzer();
const dashboard = new DashboardService(fetcher, analyzer);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'F1 Dashboard API is working!' });
});

async function apiCall(res, callback) {
    try {
        res.json(await callback());
    } catch (error) {
        console.error('OpenF1 request failed:', error.message);
        res.status(502).json({ error: 'OpenF1 data is temporarily unavailable', detail: error.message });
    }
}

app.get('/api/sessions/:year', (req, res) => apiCall(res, async () => ({
    sessions: normalizeSessions(await fetcher.getSessions(req.params.year))
})));
app.get('/api/drivers/:sessionKey', (req, res) => apiCall(res, async () => ({
    drivers: normalizeDrivers(await fetcher.getDrivers(req.params.sessionKey))
})));
app.get('/api/session-results/:sessionKey', (req, res) => apiCall(res, async () => {
    const [rawResults, rawDrivers] = await Promise.all([
        fetcher.getSessionResults(req.params.sessionKey),
        fetcher.getDrivers(req.params.sessionKey)
    ]);
    const drivers = new Map(normalizeDrivers(rawDrivers).map(driver => [String(driver.driver_number), driver]));
    const latestByDriver = new Map();
    (Array.isArray(rawResults) ? rawResults : []).forEach(result => {
        const key = String(result.driver_number);
        const current = latestByDriver.get(key);
        if (!current || new Date(result.date || 0) > new Date(current.date || 0)) latestByDriver.set(key, result);
    });
    const results = [...latestByDriver.values()]
        .sort((first, second) => Number(first.position || 999) - Number(second.position || 999))
        .map(result => ({
            ...result,
            driver_number: String(result.driver_number),
            name: drivers.get(String(result.driver_number))?.full_name || drivers.get(String(result.driver_number))?.name_acronym || `Car ${result.driver_number}`,
            team: drivers.get(String(result.driver_number))?.team_name || 'Team unavailable'
        }));
    return { results, source: 'OpenF1 session classification' };
}));
app.get('/api/history/:year', (req, res) => apiCall(res, async () => ({
    ...(await fetcher.getHistoricalSeason(req.params.year))
})));

app.get('/api/compare/:sessionKey/:driver1/:driver2', (req, res) => apiCall(res, async () => {
    const { sessionKey, driver1, driver2 } = req.params;
    return dashboard.compare(sessionKey, driver1, driver2);
}));

// Serve main dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`🏎️ F1 Pit Wall Dashboard running at http://localhost:${port}`);
    console.log(`📊 Open your browser to view the dashboard`);
});