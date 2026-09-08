const { toNumber } = require('../utils/dataUtils');

class DashboardService {
    constructor(fetcher, analyzer) {
        this.fetcher = fetcher;
        this.analyzer = analyzer;
    }

    async compare(sessionKey, driver1, driver2) {
        if (String(driver1) === String(driver2)) {
            throw new Error('Choose two different drivers');
        }

        const [telemetry1, telemetry2] = await Promise.all([
            this.fetcher.getCarData(sessionKey, driver1),
            this.fetcher.getCarData(sessionKey, driver2)
        ]);

        const prepare = (driverNumber, raw) => {
            const rows = (Array.isArray(raw) ? raw : [])
                .filter(point => Number.isFinite(Number(point.speed)))
                .slice(-1200)
                .map((point, index, all) => ({
                    distance: index,
                    speed: toNumber(point.speed),
                    throttle: toNumber(point.throttle),
                    brake: point.brake ? 100 : 0,
                    gear: toNumber(point.n_gear),
                    normalizedDistance: all.length > 1 ? index / (all.length - 1) : 0
                }));

            this.analyzer.addTelemetry(driverNumber, rows);
            return this.analyzer.interpolateTelemetry(driverNumber, 160);
        };

        const first = prepare(driver1, telemetry1);
        const second = prepare(driver2, telemetry2);
        if (!first.length || !second.length) {
            throw new Error('No car data was returned for one or both drivers');
        }

        return {
            driver1: String(driver1),
            driver2: String(driver2),
            comparison: this.analyzer.compareDrivers(driver1, driver2, 160),
            source: 'OpenF1 car data'
        };
    }
}

module.exports = DashboardService;
