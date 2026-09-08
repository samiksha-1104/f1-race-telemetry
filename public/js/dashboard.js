/**
 * F1 Dashboard Client-side JavaScript
 */

let currentData = null;
let sessionRequestId = 0;
let driverRequestId = 0;

const worldChampions = {
    1988: ['Ayrton Senna', 'McLaren'], 1989: ['Alain Prost', 'McLaren'],
    1990: ['Ayrton Senna', 'McLaren'], 1991: ['Ayrton Senna', 'McLaren'],
    1992: ['Nigel Mansell', 'Williams'], 1993: ['Alain Prost', 'Williams'],
    1994: ['Michael Schumacher', 'Benetton'], 1995: ['Michael Schumacher', 'Benetton'],
    1996: ['Damon Hill', 'Williams'], 1997: ['Jacques Villeneuve', 'Williams'],
    1998: ['Mika Hakkinen', 'McLaren'], 1999: ['Mika Hakkinen', 'McLaren'],
    2000: ['Michael Schumacher', 'Ferrari'], 2001: ['Michael Schumacher', 'Ferrari'],
    2002: ['Michael Schumacher', 'Ferrari'], 2003: ['Michael Schumacher', 'Ferrari'],
    2004: ['Michael Schumacher', 'Ferrari'], 2005: ['Fernando Alonso', 'Renault'],
    2006: ['Fernando Alonso', 'Renault'], 2007: ['Kimi Raikkonen', 'Ferrari'],
    2008: ['Lewis Hamilton', 'McLaren'], 2009: ['Jenson Button', 'Brawn'],
    2010: ['Sebastian Vettel', 'Red Bull Racing'], 2011: ['Sebastian Vettel', 'Red Bull Racing'],
    2012: ['Sebastian Vettel', 'Red Bull Racing'], 2013: ['Sebastian Vettel', 'Red Bull Racing'],
    2014: ['Lewis Hamilton', 'Mercedes'], 2015: ['Lewis Hamilton', 'Mercedes'],
    2016: ['Nico Rosberg', 'Mercedes'], 2017: ['Lewis Hamilton', 'Mercedes'],
    2018: ['Lewis Hamilton', 'Mercedes'], 2019: ['Lewis Hamilton', 'Mercedes'],
    2020: ['Lewis Hamilton', 'Mercedes'], 2021: ['Max Verstappen', 'Red Bull Racing'],
    2022: ['Max Verstappen', 'Red Bull Racing'], 2023: ['Max Verstappen', 'Red Bull Racing'],
    2024: ['Max Verstappen', 'Red Bull Racing'], 2025: ['Lando Norris', 'McLaren']
};
const telemetryYears = new Set([2023, 2024, 2025]);
const recentDriverGrids = {
    2025: [['Lando Norris', 'McLaren'], ['Oscar Piastri', 'McLaren'], ['Max Verstappen', 'Red Bull'], ['Liam Lawson', 'Racing Bulls'], ['Charles Leclerc', 'Ferrari'], ['Lewis Hamilton', 'Ferrari'], ['George Russell', 'Mercedes'], ['Andrea Kimi Antonelli', 'Mercedes'], ['Fernando Alonso', 'Aston Martin'], ['Lance Stroll', 'Aston Martin'], ['Pierre Gasly', 'Alpine'], ['Franco Colapinto', 'Alpine'], ['Alex Albon', 'Williams'], ['Carlos Sainz', 'Williams'], ['Yuki Tsunoda', 'Red Bull'], ['Nico Hulkenberg', 'Sauber'], ['Esteban Ocon', 'Haas'], ['Oliver Bearman', 'Haas'], ['Isack Hadjar', 'Racing Bulls'], ['Gabriel Bortoleto', 'Sauber']],
    2024: [['Max Verstappen', 'Red Bull'], ['Sergio Perez', 'Red Bull'], ['Lando Norris', 'McLaren'], ['Oscar Piastri', 'McLaren'], ['Charles Leclerc', 'Ferrari'], ['Carlos Sainz', 'Ferrari'], ['Lewis Hamilton', 'Mercedes'], ['George Russell', 'Mercedes'], ['Fernando Alonso', 'Aston Martin'], ['Lance Stroll', 'Aston Martin'], ['Pierre Gasly', 'Alpine'], ['Esteban Ocon', 'Alpine'], ['Alex Albon', 'Williams'], ['Logan Sargeant', 'Williams'], ['Yuki Tsunoda', 'RB'], ['Daniel Ricciardo', 'RB'], ['Nico Hulkenberg', 'Haas'], ['Kevin Magnussen', 'Haas'], ['Valtteri Bottas', 'Sauber'], ['Zhou Guanyu', 'Sauber']],
    2023: [['Max Verstappen', 'Red Bull'], ['Sergio Perez', 'Red Bull'], ['Lewis Hamilton', 'Mercedes'], ['George Russell', 'Mercedes'], ['Charles Leclerc', 'Ferrari'], ['Carlos Sainz', 'Ferrari'], ['Lando Norris', 'McLaren'], ['Oscar Piastri', 'McLaren'], ['Fernando Alonso', 'Aston Martin'], ['Lance Stroll', 'Aston Martin'], ['Esteban Ocon', 'Alpine'], ['Pierre Gasly', 'Alpine'], ['Alex Albon', 'Williams'], ['Logan Sargeant', 'Williams'], ['Yuki Tsunoda', 'AlphaTauri'], ['Nyck de Vries', 'AlphaTauri'], ['Valtteri Bottas', 'Alfa Romeo'], ['Zhou Guanyu', 'Alfa Romeo'], ['Kevin Magnussen', 'Haas'], ['Nico Hulkenberg', 'Haas']],
    2022: [['Max Verstappen', 'Red Bull'], ['Sergio Perez', 'Red Bull'], ['Charles Leclerc', 'Ferrari'], ['Carlos Sainz', 'Ferrari'], ['Lewis Hamilton', 'Mercedes'], ['George Russell', 'Mercedes'], ['Lando Norris', 'McLaren'], ['Daniel Ricciardo', 'McLaren'], ['Fernando Alonso', 'Alpine'], ['Esteban Ocon', 'Alpine'], ['Valtteri Bottas', 'Alfa Romeo'], ['Zhou Guanyu', 'Alfa Romeo'], ['Pierre Gasly', 'AlphaTauri'], ['Yuki Tsunoda', 'AlphaTauri'], ['Sebastian Vettel', 'Aston Martin'], ['Lance Stroll', 'Aston Martin'], ['Alex Albon', 'Williams'], ['Nicholas Latifi', 'Williams'], ['Kevin Magnussen', 'Haas'], ['Mick Schumacher', 'Haas']],
    2021: [['Lewis Hamilton', 'Mercedes'], ['Valtteri Bottas', 'Mercedes'], ['Max Verstappen', 'Red Bull'], ['Sergio Perez', 'Red Bull'], ['Lando Norris', 'McLaren'], ['Daniel Ricciardo', 'McLaren'], ['Charles Leclerc', 'Ferrari'], ['Carlos Sainz', 'Ferrari'], ['Fernando Alonso', 'Alpine'], ['Esteban Ocon', 'Alpine'], ['Pierre Gasly', 'AlphaTauri'], ['Yuki Tsunoda', 'AlphaTauri'], ['Sebastian Vettel', 'Aston Martin'], ['Lance Stroll', 'Aston Martin'], ['Kimi Raikkonen', 'Alfa Romeo'], ['Antonio Giovinazzi', 'Alfa Romeo'], ['George Russell', 'Williams'], ['Nicholas Latifi', 'Williams'], ['Nikita Mazepin', 'Haas'], ['Mick Schumacher', 'Haas']]
};
const incidentAtlas = [
    {
        year: 2021, race: 'British Grand Prix · Silverstone', type: 'IMPACT DATA', tone: 'impact',
        title: 'Verstappen / Hamilton · Copse',
        detail: 'Max Verstappen went into the tyre barrier after contact with Lewis Hamilton on lap one. Red Bull reported a 51G impact; Verstappen was taken to hospital for precautionary checks and released the same day.',
        note: 'Official race classification: Verstappen DNF · Hamilton received a 10-second penalty.',
        source: 'https://en.wikipedia.org/wiki/2021_British_Grand_Prix'
    },
    {
        year: 1994, race: 'San Marino Grand Prix · Imola', type: 'FATALITY', tone: 'fatality',
        title: 'Ayrton Senna · Tamburello',
        detail: 'Senna died after a crash at Tamburello during the race. The official Italian investigation and later reporting described fatal head injuries after the Williams left the circuit at high speed.',
        note: 'The same weekend also saw the death of Roland Ratzenberger during qualifying.',
        source: 'https://en.wikipedia.org/wiki/1994_San_Marino_Grand_Prix'
    },
    {
        year: 2014, race: 'Japanese Grand Prix · Suzuka', type: 'FATALITY', tone: 'fatality',
        title: 'Jules Bianchi · Dunlop',
        detail: 'Bianchi suffered a severe head injury after colliding with a recovery vehicle in wet conditions. He died in 2015 from injuries sustained in that 2014 race crash.',
        note: 'His accident led to major changes in recovery procedures and the introduction of the Virtual Safety Car.',
        source: 'https://en.wikipedia.org/wiki/Jules_Bianchi'
    },
    {
        year: 1970, race: 'Italian Grand Prix · Monza', type: 'FATALITY', tone: 'fatality',
        title: 'Jochen Rindt · Parabolica',
        detail: 'Rindt died during qualifying after a crash at Parabolica. He became the only posthumous Formula 1 Drivers’ World Champion, winning the 1970 title after his death.',
        note: 'Cause recorded here: fatal crash injuries, not a mechanical retirement classification.',
        source: 'https://en.wikipedia.org/wiki/Jochen_Rindt'
    }
];

const $ = id => document.getElementById(id);
const setNotice = (message = '', type = '') => {
    $('notice').textContent = message;
    $('notice').className = `notice ${type}`;
    const isConnecting = /loading|connecting|pulling/i.test(message);
    $('statusText').textContent = type === 'error' ? 'Feed requires attention' : type === 'success' ? 'Telemetry ready' : isConnecting ? 'Connecting to feed' : 'Session ready';
};

function setSelectLoading(select, label) {
    select.innerHTML = `<option value="">${label}</option>`;
    select.disabled = true;
    select.classList.remove('ready');
}

function formatSessionDate(date) {
    if (!date) return 'Date TBC';
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(date));
}

function sessionMeetingLabel(session) {
    const country = session.country_name || 'International';
    const circuit = session.circuit_short_name || session.location || session.circuit_name || 'Circuit';
    return `${country} / ${circuit}`;
}

function resultSessionType() {
    return $('session').selectedOptions[0]?.dataset.type || 'Session';
}

function formatResultTime(result) {
    if (result.dnf) return 'DNF';
    if (result.dns) return 'DNS';
    if (result.dsq) return 'DSQ';
    if (Number.isFinite(Number(result.gap_to_leader)) && Number(result.position) > 1) return `+${Number(result.gap_to_leader).toFixed(3)}s`;
    if (Number.isFinite(Number(result.duration))) return `${Number(result.duration).toFixed(3)}s`;
    return `${result.number_of_laps || 0} laps`;
}

function renderSessionResults(results, source) {
    const type = resultSessionType();
    const isRace = type === 'Race' || type === 'Sprint';
    const title = type === 'Qualifying' ? 'Pole position & classification' : isRace ? `${type} result` : `${type} classification`;
    $('resultTitle').textContent = title;
    $('resultSource').textContent = source || 'OpenF1 timing feed';
    $('sessionResults').hidden = false;
    if (!results.length) {
        $('resultHero').innerHTML = '<span class="result-empty">No official classification has been published for this session yet.</span>';
        $('podiumGrid').innerHTML = '';
        $('classificationList').innerHTML = '';
        return;
    }
    const winner = results[0];
    const winnerLabel = type === 'Qualifying' ? 'POLE POSITION' : isRace ? 'WINNER' : 'SESSION LEADER';
    $('resultHero').innerHTML = `<span class="result-kicker">${winnerLabel}</span><strong>${winner.name}</strong><span>${winner.team} · Car ${winner.driver_number} · ${formatResultTime(winner)}</span>`;
    $('podiumGrid').innerHTML = results.slice(0, 3).map((result, index) => `<article class="podium-card podium-${index + 1}"><b>P${index + 1}</b><strong>${result.name}</strong><span>${result.team}</span><small>${formatResultTime(result)}${result.points ? ` · ${result.points} pts` : ''}</small></article>`).join('');
    $('classificationList').innerHTML = results.slice(3).map(result => `<div class="classification-row"><b>${result.position || '—'}</b><strong>${result.name}</strong><span>${result.team}</span><em>${formatResultTime(result)}</em></div>`).join('');
}

async function loadSessionResults(sessionKey) {
    $('sessionResults').hidden = false;
    $('resultHero').innerHTML = '<span class="result-loading">Reading the official classification...</span>';
    $('podiumGrid').innerHTML = '';
    $('classificationList').innerHTML = '';
    try {
        const response = await fetch(`/api/session-results/${sessionKey}`);
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Classification unavailable');
        renderSessionResults(payload.results || [], payload.source);
    } catch (error) {
        $('resultHero').innerHTML = `<span class="result-empty">${error.message}</span>`;
        $('podiumGrid').innerHTML = '';
        $('classificationList').innerHTML = '';
    }
}

function resetDriverCards() {
    renderDriverCard('driverCard1', null, '01');
    renderDriverCard('driverCard2', null, '02');
}

function renderDriverCard(id, driver, car) {
    const card = $(id);
    if (!driver) {
        card.innerHTML = `<div class="portrait-placeholder">${car}</div><div><small>CAR ${car}</small><strong>Select a driver</strong><span>Waiting for session</span></div>`;
        return;
    }
    const color = driver.team_colour ? `#${driver.team_colour}` : '#e10600';
    const image = driver.headshot_url ? `<img src="${driver.headshot_url}" alt="${driver.full_name}">` : `<div class="portrait-placeholder">${driver.name_acronym || car}</div>`;
    card.style.setProperty('--team-color', color);
    card.innerHTML = `${image}<div><small>CAR ${driver.driver_number} · ${driver.team_name || 'F1 TEAM'}</small><strong>${driver.full_name}</strong><span>${driver.name_acronym || 'Driver'} · #${driver.driver_number}</span></div>`;
}

function selectOptions(select, drivers) {
    select.innerHTML = '<option value="">Select driver</option>';
    select.disabled = false;
    drivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.driver_number;
        option.textContent = `${driver.name_acronym || driver.full_name} · #${driver.driver_number}`;
        option.dataset.driver = JSON.stringify(driver);
        select.appendChild(option);
    });
}

function syncDriverCard(selectId, cardId, car) {
    const option = $(selectId).selectedOptions[0];
    renderDriverCard(cardId, option && option.dataset.driver ? JSON.parse(option.dataset.driver) : null, car);
}

function renderChampions(selectedYear) {
    const selected = Number(selectedYear);
    const champion = worldChampions[selected];
    $('championSeason').textContent = `${selected} season`;
    $('championFeature').innerHTML = champion
        ? `<strong>${champion[0]}</strong><span>${champion[1]} · Drivers' World Champion</span>`
        : '<strong>Champion data unavailable</strong><span>Select a season from the historical list</span>';
    $('championList').innerHTML = Object.entries(worldChampions)
        .sort(([first], [second]) => Number(second) - Number(first))
        .map(([year, details]) => `<button class="champion-item${Number(year) === selected ? ' active' : ''}" data-year="${year}"><b>${year}</b><span>${details[0]}</span></button>`)
        .join('');
    document.querySelectorAll('.champion-item').forEach(item => {
        item.addEventListener('click', () => {
            const year = Number(item.dataset.year);
            renderChampions(year);
            loadHistoricalAnalysis(year, 'historicalAnalysis');
        });
    });
}

function renderIncidentAtlas(selectedYear = 2021) {
    const featured = incidentAtlas.find(incident => incident.year === Number(selectedYear)) || incidentAtlas[0];
    $('incidentFeature').innerHTML = `<span class="feature-kicker">${featured.type} · ${featured.year}</span><strong>${featured.title}</strong><span>${featured.race}</span><p>${featured.detail}</p><small>${featured.note}</small><a href="${featured.source}" target="_blank" rel="noreferrer">Wikipedia source ↗</a>`;
    $('atlasGrid').innerHTML = incidentAtlas.filter(incident => incident !== featured).map(incident => `<article class="atlas-card ${incident.tone}" data-incident-year="${incident.year}"><div><b>${incident.year}</b><span>${incident.type}</span></div><h3>${incident.title}</h3><p>${incident.detail}</p><small>${incident.note}</small><a href="${incident.source}" target="_blank" rel="noreferrer">Wikipedia source ↗</a></article>`).join('');
}

function focusIncidentForYear(year) {
    const incident = incidentAtlas.find(item => item.year === Number(year));
    if (!incident) return;
    renderIncidentAtlas(year);
    requestAnimationFrame(() => {
        $('incidentAtlas').scrollIntoView({ behavior: 'smooth', block: 'start' });
        $('incidentAtlas').classList.add('is-focused');
        setTimeout(() => $('incidentAtlas').classList.remove('is-focused'), 1600);
    });
}

function renderDriverGrid(year, drivers = []) {
    const current = drivers.length ? drivers.map(driver => [driver.full_name || driver.name_acronym || `Car ${driver.driver_number}`, driver.team_name || 'Team unavailable', driver.driver_number]) : [];
    $('currentGrid').innerHTML = current.length ? current.map(([name, team, number]) => `<article class="grid-driver"><b>${number || '—'}</b><strong>${name}</strong><span>${team}</span></article>`).join('') : '<p class="grid-empty">Choose a session to load the current grid.</p>';
    $('gridMeta').textContent = current.length ? `${current.length} cars · ${year} session grid` : 'Current session grid';
    $('pastGrid').innerHTML = Object.entries(recentDriverGrids).sort(([first], [second]) => Number(second) - Number(first)).map(([season, entries]) => `<details class="season-grid"${Number(season) === Number(year) ? ' open' : ''}><summary>${season} grid <span>${entries.length} drivers</span></summary><div>${entries.map(([name, team]) => `<span><b>${name}</b>${team}</span>`).join('')}</div></details>`).join('');
}

async function loadCurrentDriverGrid(year, sessions) {
    const latestRace = sessions.slice().reverse().find(session => /race|sprint/i.test(session.session_name || session.session_type || '')) || sessions[sessions.length - 1];
    if (!latestRace) { renderDriverGrid(year); return; }
    try {
        const response = await fetch(`/api/drivers/${latestRace.session_key}`);
        const payload = await response.json();
        renderDriverGrid(year, payload.drivers || []);
    } catch (error) {
        renderDriverGrid(year);
    }
}

function showTelemetryView() {
    document.querySelectorAll('.telemetry-view').forEach(element => { element.hidden = false; });
    $('historicalAnalysis').hidden = true;
}

function openTelemetryView() {
    showTelemetryView();
    requestAnimationFrame(() => $('telemetrySection').scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

async function loadHistoricalAnalysis(year, scrollTarget = '') {
    document.querySelectorAll('.telemetry-view').forEach(element => { element.hidden = true; });
    $('historicalAnalysis').hidden = false;
    $('historicalDetails').innerHTML = '<p class="historical-loading">Loading historical championship results...</p>';
    if (scrollTarget) {
        requestAnimationFrame(() => $(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
    setNotice(`Loading ${year} championship analysis from the historical results archive...`);
    try {
        const response = await fetch(`/api/history/${year}`);
        const payload = await response.json();
        if (!response.ok || !payload.champion) throw new Error(payload.error || 'Historical results unavailable');
        const champion = payload.champion;
        $('historicalDetails').innerHTML = `
            <div class="metric-card"><h3>World champion</h3><p>${champion.name}</p></div>
            <div class="metric-card"><h3>Constructor</h3><p>${champion.team}</p></div>
            <div class="metric-card"><h3>Championship points</h3><p>${champion.points}</p></div>
            <div class="metric-card"><h3>Race wins</h3><p>${champion.wins}</p></div>`;
        $('raceTimeline').innerHTML = payload.races.map(race => {
            const incidents = race.incidents || [];
            const entries = race.entries || [];
            const incidentSummary = incidents.length
                ? incidents.map(entry => `<li><b>${entry.category}</b><span>Car ${entry.carNumber} · ${entry.name}</span><em>${entry.issue} · “${entry.status}”</em></li>`).join('')
                : '<li class="clear"><b>CLEAR</b><span>No non-finish recorded</span><em>All archived cars classified</em></li>';
            const fullReport = entries.map(entry => `<div class="car-report-row"><b>Car ${entry.carNumber}</b><strong>${entry.name}</strong><span>${entry.team}</span><em class="status-${entry.category.toLowerCase()}">${entry.category} · ${entry.status}</em><small>P${entry.position} · ${entry.laps} laps</small></div>`).join('');
            return `<article class="race-result">
                <div class="race-result-head"><b>R${race.round}</b><span>${race.name} · ${formatSessionDate(race.date)}</span><strong>${race.winner}</strong></div>
                <ul class="race-incidents">${incidentSummary}</ul>
                <details class="race-report"><summary>Open ${entries.length}-car report</summary><div>${fullReport}</div></details>
            </article>`;
        }).join('');
        const incidents = payload.drivers.filter(driver => driver.dnf || driver.dns || driver.crashes);
        $('incidentBoard').innerHTML = `
            <div class="incident-heading"><h3>Retirements & incidents</h3><span>${incidents.length} drivers with a non-finish record</span></div>
            <div class="incident-list">${incidents.map(driver => `<div class="incident-row"><strong>${driver.name}</strong><span>${driver.crashes ? `<b class="crash">${driver.crashes} crash${driver.crashes > 1 ? 'es' : ''}</b>` : ''}${driver.dnf ? `<b class="dnf">${driver.dnf} DNF</b>` : ''}${driver.dns ? `<b class="dns">${driver.dns} DNS</b>` : ''}</span></div>`).join('')}</div>`;
        setNotice(`${year} season analysis ready · ${payload.races.length} races · OpenF1 telemetry begins in 2023.`, 'success');
    } catch (error) {
        $('historicalDetails').innerHTML = '<p class="historical-loading">Historical results could not be loaded.</p>';
        $('raceTimeline').innerHTML = '';
        $('incidentBoard').innerHTML = '';
        setNotice(error.message, 'error');
    }
}

async function loadSessions(year) {
    const requestId = ++sessionRequestId;
    if (!year) return;
    setSelectLoading($('session'), 'Loading sessions...');
    setSelectLoading($('driver1'), 'Choose a session first');
    setSelectLoading($('driver2'), 'Choose a session first');
    resetDriverCards();
    setNotice('Connecting to the OpenF1 timing feed...');
    try {
        const response = await fetch(`/api/sessions/${year}`);
        if (!response.ok) throw new Error('Session feed unavailable');
        const payload = await response.json();
        const sessions = payload.sessions || [];
        if (requestId !== sessionRequestId) return;
        const sessionSelect = $('session');
        sessionSelect.innerHTML = '<option value="">Select a session</option>';
        sessionSelect.disabled = false;
        const meetings = new Map();
        sessions.slice().reverse().forEach(session => {
            const meetingKey = session.meeting_key || session.circuit_key || sessionMeetingLabel(session);
            if (!meetings.has(meetingKey)) meetings.set(meetingKey, []);
            meetings.get(meetingKey).push(session);
        });
        meetings.forEach((meetingSessions, meetingKey) => {
            const group = document.createElement('optgroup');
            group.label = sessionMeetingLabel(meetingSessions[0]);
            group.dataset.meeting = meetingKey;
            meetingSessions.forEach(session => {
                const option = document.createElement('option');
                option.value = session.session_key;
                option.textContent = `${session.session_name} · ${formatSessionDate(session.date_start)}`;
                option.dataset.meeting = group.label;
                option.dataset.date = session.date_start || '';
                option.dataset.type = session.session_name || session.session_type || 'Session';
                group.appendChild(option);
            });
            sessionSelect.appendChild(group);
        });
        $('sessionMeta').textContent = `${meetings.size} race weekends · ${sessions.length} sessions · newest first`;
        loadCurrentDriverGrid(year, sessions);
        setNotice(`${sessions.length} sessions across ${meetings.size} race weekends. Pick a run to begin.`);
    } catch (error) {
        if (requestId !== sessionRequestId) return;
        console.error('Error loading sessions:', error);
        setNotice('Could not reach OpenF1. Check your connection and try again.', 'error');
    }
}

// Load sessions when year changes and on the initial page load.
$('year').addEventListener('change', event => loadSessions(event.target.value));
$('year').addEventListener('change', event => renderChampions(event.target.value));
$('year').addEventListener('change', showTelemetryView);

// Load drivers when session changes
document.getElementById('session').addEventListener('change', async function() {
    const sessionKey = this.value;
    this.classList.toggle('ready', Boolean(sessionKey));
    const selectedSession = this.selectedOptions[0];
    $('sessionMeta').textContent = selectedSession?.dataset.meeting ? `${selectedSession.dataset.meeting} · ${formatSessionDate(selectedSession.dataset.date)} · loading grid` : 'Race weekends will appear here';
    if (sessionKey) loadSessionResults(sessionKey);
    else $('sessionResults').hidden = true;
    if (!sessionKey) { setSelectLoading($('driver1'), 'Choose a session first'); setSelectLoading($('driver2'), 'Choose a session first'); resetDriverCards(); return; }
    const requestId = ++driverRequestId;
    setSelectLoading($('driver1'), 'Loading drivers...');
    setSelectLoading($('driver2'), 'Loading drivers...');
    setNotice('Pulling the starting grid and driver portraits...');
    try {
        const response = await fetch(`/api/drivers/${sessionKey}`);
        if (!response.ok) throw new Error('Driver feed unavailable');
        const payload = await response.json();
        const drivers = payload.drivers || [];
        if (requestId !== driverRequestId) return;
        if (!drivers.length) throw new Error('No drivers found for this session');
        selectOptions($('driver1'), drivers);
        selectOptions($('driver2'), drivers);
        $('sessionMeta').textContent = `${selectedSession.dataset.meeting} · ${drivers.length} cars on the grid`;
        setNotice(`${drivers.length} drivers ready. Choose two cars for a telemetry run.`);
    } catch (error) {
        if (requestId !== driverRequestId) return;
        console.error('Error loading drivers:', error);
        setNotice('Driver data could not be loaded for this session.', 'error');
    }
});

['driver1', 'driver2'].forEach((id, index) => $(id).addEventListener('change', () => syncDriverCard(id, `driverCard${index + 1}`, String(index + 1).padStart(2, '0'))));

document.querySelector('[data-action="history"]').addEventListener('click', event => {
    event.preventDefault();
    loadHistoricalAnalysis(Number($('year').value), 'historicalAnalysis');
});
document.querySelector('[data-action="telemetry"]').addEventListener('click', event => {
    event.preventDefault();
    openTelemetryView();
});

// Load comparison data
async function loadData() {
    const sessionKey = document.getElementById('session').value;
    const driver1 = document.getElementById('driver1').value;
    const driver2 = document.getElementById('driver2').value;
    
    if (!sessionKey || !driver1 || !driver2) {
        setNotice('Select a session and two drivers before comparing telemetry.', 'error');
        return;
    }
    
    const loadBtn = document.getElementById('loadBtn');
    document.body.classList.add('is-loading');
    loadBtn.querySelector('.button-label').textContent = 'Loading telemetry';
    loadBtn.querySelector('.button-arrow').textContent = '◌';
    loadBtn.disabled = true;
    
    try {
        const response = await fetch(`/api/compare/${sessionKey}/${driver1}/${driver2}`);
        const data = await response.json();
        
        if (!response.ok || data.error) throw new Error(data.error || 'Telemetry unavailable');
        
        currentData = data;
        updateDashboard(data);
        setNotice(`Comparison ready · ${data.source || 'timing feed'}`, 'success');
        
    } catch (error) {
        console.error('Error loading comparison:', error);
        resetTelemetryOutput();
        setNotice(`Telemetry could not be loaded: ${error.message}`, 'error');
    } finally {
        document.body.classList.remove('is-loading');
        loadBtn.querySelector('.button-label').textContent = 'Compare telemetry';
        loadBtn.querySelector('.button-arrow').textContent = '→';
        loadBtn.disabled = false;
    }
}

function resetTelemetryOutput() {
    ['speedChart', 'deltaChart', 'throttleChart', 'brakeChart'].forEach(id => {
        if (window.Plotly) Plotly.purge(id);
    });
    $('lapTime2').textContent = '--';
    $('timeDelta').textContent = '--';
    $('speedDelta').textContent = '--';
    $('cornerAnalysis').innerHTML = '<p class="historical-loading">No car telemetry was returned for this session. Try a race or qualifying session.</p>';
}

function updateDashboard(data) {
    const comparison = data.comparison;
    if (!Array.isArray(comparison) || !comparison.length) throw new Error('The telemetry feed returned no comparable points');
    
    // Update metrics
    const driver1Data = comparison[0];
    const driver2Data = comparison[comparison.length - 1];
    
    $('lapTime1').textContent = data.source || 'OpenF1';
    $('lapTime2').textContent = comparison.length;
    
    const avgDelta = comparison.reduce((sum, point) => sum + point.speedDelta, 0) / comparison.length;
    $('speedDelta').textContent = `${avgDelta.toFixed(2)} km/h`;
    $('timeDelta').textContent = `${Math.max(...comparison.map(point => Math.abs(point.speedDelta))).toFixed(1)} km/h`;
    
    // Create speed comparison chart
    const speedTrace1 = {
        x: comparison.map(p => p.normalizedDistance * 100),
        y: comparison.map(p => p.driver1Speed),
        mode: 'lines',
        name: `Driver ${data.driver1} Speed`,
        line: { color: '#e10600', width: 2 }
    };
    
    const speedTrace2 = {
        x: comparison.map(p => p.normalizedDistance * 100),
        y: comparison.map(p => p.driver2Speed),
        mode: 'lines',
        name: `Driver ${data.driver2} Speed`,
        line: { color: '#1e41b0', width: 2 }
    };
    
    const speedLayout = {
        title: 'Speed Comparison',
        xaxis: { title: 'Lap Progress (%)' },
        yaxis: { title: 'Speed (km/h)' },
        template: 'plotly_dark',
        template: 'plotly_dark',
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#87909b', family: 'Space Grotesk' },
        margin: { t: 54, r: 24, b: 48, l: 52 },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('speedChart', [speedTrace1, speedTrace2], speedLayout);
    
    // Create delta chart
    const deltaTrace = {
        x: comparison.map(p => p.normalizedDistance * 100),
        y: comparison.map(p => p.speedDelta),
        mode: 'lines',
        name: 'Speed Delta',
        fill: 'tozeroy',
        line: { color: '#00b894', width: 2 },
        fillcolor: 'rgba(0, 184, 148, 0.3)'
    };
    
    const deltaLayout = {
        title: 'Speed Delta (Driver 1 - Driver 2)',
        xaxis: { title: 'Lap Progress (%)' },
        yaxis: { title: 'Delta (km/h)' },
        template: 'plotly_dark',
        template: 'plotly_dark',
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#87909b', family: 'Space Grotesk' },
        margin: { t: 54, r: 24, b: 48, l: 52 },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('deltaChart', [deltaTrace], deltaLayout);
    
    // Throttle comparison
    const throttleTrace1 = {
        x: comparison.map(p => p.normalizedDistance * 100),
        y: comparison.map(p => p.driver1Throttle),
        mode: 'lines',
        name: `Driver ${data.driver1} Throttle`,
        line: { color: '#e10600', width: 2, dash: 'dash' }
    };
    
    const throttleTrace2 = {
        x: comparison.map(p => p.normalizedDistance * 100),
        y: comparison.map(p => p.driver2Throttle),
        mode: 'lines',
        name: `Driver ${data.driver2} Throttle`,
        line: { color: '#1e41b0', width: 2, dash: 'dash' }
    };
    
    const throttleLayout = {
        title: 'Throttle Comparison',
        xaxis: { title: 'Lap Progress (%)' },
        yaxis: { title: 'Throttle (%)' },
        template: 'plotly_dark',
        template: 'plotly_dark',
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#87909b', family: 'Space Grotesk' },
        margin: { t: 54, r: 24, b: 48, l: 52 },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('throttleChart', [throttleTrace1, throttleTrace2], throttleLayout);
    
    // Brake comparison
    const brakeTrace1 = {
        x: comparison.map(p => p.normalizedDistance * 100),
        y: comparison.map(p => p.driver1Brake),
        mode: 'lines',
        name: `Driver ${data.driver1} Brake`,
        line: { color: '#e10600', width: 2, dash: 'dot' }
    };
    
    const brakeTrace2 = {
        x: comparison.map(p => p.normalizedDistance * 100),
        y: comparison.map(p => p.driver2Brake),
        mode: 'lines',
        name: `Driver ${data.driver2} Brake`,
        line: { color: '#1e41b0', width: 2, dash: 'dot' }
    };
    
    const brakeLayout = {
        title: 'Brake Comparison',
        xaxis: { title: 'Lap Progress (%)' },
        yaxis: { title: 'Brake (%)' },
        template: 'plotly_dark',
        template: 'plotly_dark',
        paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#87909b', family: 'Space Grotesk' },
        margin: { t: 54, r: 24, b: 48, l: 52 },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('brakeChart', [brakeTrace1, brakeTrace2], brakeLayout);
    
    // Corner analysis
    const cornerAnalysis = document.getElementById('cornerAnalysis');
    cornerAnalysis.innerHTML = '';
    
    // Identify corners (where speed delta changes significantly)
    const corners = identifyCorners(comparison);
    corners.forEach((corner, index) => {
        const div = document.createElement('div');
        div.className = 'metric-card';
        div.innerHTML = `
            <h3>Corner ${index + 1}</h3>
            <p>Delta: ${corner.delta.toFixed(2)} km/h</p>
            <small>${corner.delta > 0 ? '🔴 Driver 1 faster' : '🔵 Driver 2 faster'}</small>
        `;
        cornerAnalysis.appendChild(div);
    });
}

function identifyCorners(comparison) {
    const corners = [];
    const threshold = 5; // km/h delta threshold
    
    let inCorner = false;
    let cornerStart = 0;
    let maxDelta = 0;
    
    comparison.forEach((point, i) => {
        const delta = Math.abs(point.speedDelta);
        
        if (delta > threshold && !inCorner) {
            inCorner = true;
            cornerStart = i;
            maxDelta = point.speedDelta;
        } else if (delta > threshold && inCorner) {
            if (Math.abs(point.speedDelta) > Math.abs(maxDelta)) {
                maxDelta = point.speedDelta;
            }
        } else if (delta <= threshold && inCorner) {
            inCorner = false;
            corners.push({
                start: cornerStart,
                end: i,
                delta: maxDelta
            });
        }
    });
    
    return corners.slice(0, 5); // Return top 5 corners
}

loadSessions($('year').value);
renderChampions($('year').value);
renderIncidentAtlas();
if (window.location.hash === '#historicalAnalysis') loadHistoricalAnalysis(Number($('year').value));
else showTelemetryView();