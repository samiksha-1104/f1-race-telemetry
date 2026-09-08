/**
 * Telemetry Analysis Module
 * Analyzes F1 telemetry data
 */

class TelemetryAnalyzer {
    constructor() {
        this.telemetryData = {};
        this.processedData = {};
    }

    addTelemetry(driverId, telemetryData) {
        this.telemetryData[driverId] = telemetryData;
        console.log(`Added telemetry for driver ${driverId}`);
    }

    interpolateTelemetry(driverId, numPoints = 1000) {
        if (!this.telemetryData[driverId]) {
            console.error(`No data for driver ${driverId}`);
            return null;
        }

        const data = this.telemetryData[driverId];
        if (!data.length) return [];
        
        // Find max distance for normalization
        const maxDistance = Math.max(...data.map(d => d.distance), 0);
        
        // Normalize and interpolate
        const normalizedData = data.map(d => ({
            ...d,
            normalizedDistance: maxDistance ? d.distance / maxDistance : 0
        }));

        // Sort by normalized distance
        normalizedData.sort((a, b) => a.normalizedDistance - b.normalizedDistance);

        // Interpolate to uniform points
        const interpolated = [];
        for (let i = 0; i < numPoints; i++) {
            const targetX = i / (numPoints - 1);
            // Find nearest points
            let j = 0;
            while (j < normalizedData.length - 1 && normalizedData[j + 1].normalizedDistance < targetX) {
                j++;
            }
            
            if (j >= normalizedData.length - 1) {
                interpolated.push({
                    normalizedDistance: targetX,
                    speed: normalizedData[normalizedData.length - 1].speed,
                    throttle: normalizedData[normalizedData.length - 1].throttle || 0,
                    brake: normalizedData[normalizedData.length - 1].brake || 0,
                    gear: normalizedData[normalizedData.length - 1].gear || 0
                });
            } else {
                const x0 = normalizedData[j].normalizedDistance;
                const x1 = normalizedData[j + 1].normalizedDistance;
                const distance = x1 - x0;
                const t = distance ? (targetX - x0) / distance : 0;
                
                interpolated.push({
                    normalizedDistance: targetX,
                    speed: this.lerp(normalizedData[j].speed, normalizedData[j + 1].speed, t),
                    throttle: this.lerp(normalizedData[j].throttle || 0, normalizedData[j + 1].throttle || 0, t),
                    brake: this.lerp(normalizedData[j].brake || 0, normalizedData[j + 1].brake || 0, t),
                    gear: Math.round(this.lerp(normalizedData[j].gear || 0, normalizedData[j + 1].gear || 0, t))
                });
            }
        }

        this.processedData[driverId] = interpolated;
        return interpolated;
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    compareDrivers(driver1, driver2, numPoints = 1000) {
        if (!this.processedData[driver1]) {
            this.interpolateTelemetry(driver1, numPoints);
        }
        if (!this.processedData[driver2]) {
            this.interpolateTelemetry(driver2, numPoints);
        }

        const d1 = this.processedData[driver1];
        const d2 = this.processedData[driver2];

        return d1.map((point, i) => ({
            normalizedDistance: point.normalizedDistance,
            driver1Speed: point.speed,
            driver2Speed: d2[i].speed,
            speedDelta: point.speed - d2[i].speed,
            driver1Throttle: point.throttle,
            driver2Throttle: d2[i].throttle,
            driver1Brake: point.brake,
            driver2Brake: d2[i].brake
        }));
    }

    calculateDegradation(lapTimes) {
        if (lapTimes.length < 3) {
            console.warn('Not enough laps for degradation analysis');
            return null;
        }

        // Simple linear regression
        const n = lapTimes.length;
        const x = lapTimes.map((_, i) => i);
        const y = lapTimes.map(l => l.time);
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
        const sumXX = x.reduce((a, b) => a + b * b, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return {
            degradationRate: slope,
            baseTime: intercept,
            lapNumbers: x,
            lapTimes: y
        };
    }
}

module.exports = TelemetryAnalyzer;