/**
 * F1 Data Fetcher Module
 * Uses OpenF1 API (free, no authentication required)
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class F1DataFetcher {
    constructor(configPath = './config/config.json') {
        this.config = require(path.resolve(configPath));
        this.baseUrl = this.config.api.baseUrl;
        this.cacheDir = path.resolve(__dirname, '..', '..', this.config.api.cacheDir);
        this.ensureCacheDir();
    }

    async ensureCacheDir() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            console.error('Error creating cache directory:', error);
        }
    }

    async fetchData(endpoint, params = {}) {
        await fs.mkdir(this.cacheDir, { recursive: true });
        const cacheKey = `${endpoint}_${Buffer.from(JSON.stringify(params)).toString('base64url')}`;
        const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
        
        // Check cache
        try {
            const cached = await fs.readFile(cacheFile, 'utf8');
            return JSON.parse(cached);
        } catch (error) {
            // Cache miss, fetch from API
            try {
                const response = await axios.get(`${this.baseUrl}/${endpoint}`, { params });
                // Save to cache
                await fs.writeFile(cacheFile, JSON.stringify(response.data));
                return response.data;
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error.message);
                throw error;
            }
        }
    }

    async getSessions(year) {
        return await this.fetchData('sessions', { year });
    }

    async getDrivers(sessionKey) {
        return await this.fetchData('drivers', { session_key: sessionKey });
    }

    async getLaps(sessionKey, driverNumber) {
        return await this.fetchData('laps', { 
            session_key: sessionKey,
            driver_number: driverNumber 
        });
    }

    async getTelemetry(sessionKey, driverNumber, lapNumber) {
        return await this.fetchData('car_data', {
            session_key: sessionKey,
            driver_number: driverNumber
        });
    }

    async getCarData(sessionKey, driverNumber) {
        return await this.getTelemetry(sessionKey, driverNumber);
    }

    async getSessionResults(sessionKey) {
        try {
            const results = await this.fetchData('session_result', { session_key: sessionKey });
            if (Array.isArray(results) && results.length) return results;
        } catch (error) {
            console.warn(`Session classification unavailable for ${sessionKey}:`, error.message);
        }
        return await this.fetchData('position', { session_key: sessionKey });
    }

    async getHistoricalChampion(year) {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/driverstandings/1.json`);
        const standing = response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0];
        if (!standing) throw new Error(`No championship data was found for ${year}`);
        const driver = standing.Driver;
        return {
            year: Number(year),
            name: `${driver.givenName} ${driver.familyName}`,
            team: standing.Constructors?.[0]?.name || 'Team unavailable',
            points: Number(standing.points),
            wins: Number(standing.wins)
        };
    }

    classifyHistoricalStatus(status) {
        const value = String(status).toLowerCase();
        if (value.includes('did not start') || value.includes('dns')) {
            return { category: 'DNS', issue: 'Did not start' };
        }
        if (/accident|collision|crash|spin/.test(value)) {
            return { category: 'CRASH', issue: 'Crash or collision' };
        }
        if (/engine|power unit|power-unit|motor/.test(value)) {
            return { category: 'ENGINE', issue: 'Engine / power-unit failure' };
        }
        if (/gearbox|transmission|clutch/.test(value)) {
            return { category: 'TRANSMISSION', issue: 'Gearbox / transmission failure' };
        }
        if (/brake|suspension|puncture|wheel|hydraulic|electrical|mechanical|damage|steering/.test(value)) {
            return { category: 'DAMAGE', issue: 'Mechanical damage or system failure' };
        }
        if (/fuel|overheating|water leak|oil leak/.test(value)) {
            return { category: 'SYSTEM', issue: 'Fuel, temperature, or fluid system' };
        }
        if (value === 'finished' || value.startsWith('+') || value.includes('lap')) {
            return { category: 'FINISHED', issue: 'Classified finisher' };
        }
        return { category: 'RETIREMENT', issue: 'Retired / cause not specified in archive' };
    }

    async getHistoricalSeason(year) {
        const season = Number(year);
        const pages = [];
        let offset = 0;
        let total = 0;
        do {
            const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/results.json`, {
                params: { limit: 100, offset }
            });
            const data = response.data.MRData;
            total = Number(data.total);
            pages.push(...(data.RaceTable.Races || []));
            offset += 100;
        } while (offset < total);

        const drivers = new Map();
        const races = pages.map(race => {
            const results = race.Results || [];
            const winner = results.find(result => result.position === '1');
            const entries = results.map(result => {
                const status = String(result.status || 'Status unavailable');
                const incident = this.classifyHistoricalStatus(status);
                const driver = result.Driver || {};
                return {
                    name: `${driver.givenName || ''} ${driver.familyName || ''}`.trim() || 'Unknown driver',
                    carNumber: result.number || '—',
                    team: result.Constructor?.name || 'Team unavailable',
                    position: result.position || '—',
                    status,
                    category: incident.category,
                    issue: incident.issue,
                    laps: Number(result.laps || 0),
                    points: Number(result.points || 0)
                };
            });
            results.forEach(result => {
                const driver = result.Driver;
                const name = `${driver.givenName} ${driver.familyName}`;
                const stats = drivers.get(name) || { name, dnf: 0, dns: 0, crashes: 0 };
                const status = String(result.status || '').toLowerCase();
                const dns = status.includes('did not start');
                const crash = /accident|collision|spin|damage/.test(status);
                const classified = status === 'finished' || status.startsWith('+') || status.includes('lap');
                if (dns) stats.dns += 1;
                else if (!classified) stats.dnf += 1;
                if (crash) stats.crashes += 1;
                drivers.set(name, stats);
            });
            return {
                round: Number(race.round),
                name: race.raceName,
                winner: winner ? `${winner.Driver.givenName} ${winner.Driver.familyName}` : 'No classified winner',
                date: race.date,
                incidents: entries.filter(entry => entry.category !== 'FINISHED'),
                entries
            };
        });

        return {
            champion: await this.getHistoricalChampion(season),
            races,
            drivers: [...drivers.values()].sort((first, second) => {
                return (second.crashes - first.crashes) || (second.dnf - first.dnf) || first.name.localeCompare(second.name);
            })
        };
    }
}

module.exports = F1DataFetcher;