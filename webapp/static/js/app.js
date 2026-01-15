// Static demo mode - no API calls needed
const DEMO_MODE = true;

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const userId = tg.initDataUnsafe?.user?.id || Math.floor(Math.random() * 1000000);

// Demo data
const DEMO_DATA = {
    user: {
        user_id: userId,
        username: tg.initDataUnsafe?.user?.username || 'DemoUser',
        first_name: tg.initDataUnsafe?.user?.first_name || 'Demo',
        subscription_level: 'premium',
        join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        referral_count: 12
    },
    referral: {
        referral_code: 'DEMO' + userId.toString().slice(-4),
        referral_count: 12,
        referral_link: `https://t.me/your_bot?start=ref_DEMO${userId.toString().slice(-4)}`
    },
    dashboard: {
        subscription_name: 'PREMIUM ACCESS',
        signals_today: 47,
        referral_count: 12,
        data_stream_status: 'STABLE'
    },
    market: [
        { symbol: 'BTC/USDT', exchange: 'binance', price: 96873.88, change_24h: 0.15, volume_24h: 28500000000 },
        { symbol: 'ETH/USDT', exchange: 'binance', price: 3352.42, change_24h: 0.23, volume_24h: 12500000000 },
        { symbol: 'SOL/USDT', exchange: 'binance', price: 145.39, change_24h: -0.12, volume_24h: 3200000000 },
        { symbol: 'BNB/USDT', exchange: 'binance', price: 941.57, change_24h: 0.08, volume_24h: 1800000000 },
        { symbol: 'XRP/USDT', exchange: 'binance', price: 2.11, change_24h: 0.45, volume_24h: 2500000000 },
        { symbol: 'ADA/USDT', exchange: 'binance', price: 0.40, change_24h: -0.05, volume_24h: 450000000 },
        { symbol: 'DOGE/USDT', exchange: 'binance', price: 0.14, change_24h: 0.32, volume_24h: 1200000000 },
        { symbol: 'AVAX/USDT', exchange: 'binance', price: 14.38, change_24h: 0.18, volume_24h: 580000000 },
        { symbol: 'BTC/USDT', exchange: 'bybit', price: 96902.70, change_24h: 0.12, volume_24h: 18200000000 },
        { symbol: 'ETH/USDT', exchange: 'bybit', price: 3352.64, change_24h: 0.21, volume_24h: 8500000000 },
        { symbol: 'SOL/USDT', exchange: 'bybit', price: 145.40, change_24h: -0.10, volume_24h: 2100000000 },
        { symbol: 'BNB/USDT', exchange: 'bybit', price: 941.60, change_24h: 0.09, volume_24h: 1200000000 },
        { symbol: 'BTC/USDT', exchange: 'gateio', price: 96903.70, change_24h: 0.10, volume_24h: 15200000000 },
        { symbol: 'ETH/USDT', exchange: 'gateio', price: 3354.00, change_24h: 0.19, volume_24h: 7200000000 },
        { symbol: 'SOL/USDT', exchange: 'gateio', price: 145.43, change_24h: -0.08, volume_24h: 1800000000 },
        { symbol: 'BTC/USDT', exchange: 'okx', price: 96885.00, change_24h: 0.13, volume_24h: 19800000000 },
        { symbol: 'ETH/USDT', exchange: 'okx', price: 3352.40, change_24h: 0.22, volume_24h: 9800000000 },
        { symbol: 'SOL/USDT', exchange: 'okx', price: 145.38, change_24h: -0.11, volume_24h: 2400000000 }
    ],
    priceComparison: {
        'BTC/USDT': {
            symbol: 'BTC/USDT',
            prices: {
                binance: { price: 96873.88, volume_24h: 28500000000, change_24h: 0.15 },
                bybit: { price: 96902.70, volume_24h: 18200000000, change_24h: 0.12 },
                gateio: { price: 96903.70, volume_24h: 15200000000, change_24h: 0.10 },
                okx: { price: 96885.00, volume_24h: 19800000000, change_24h: 0.13 },
                coinbase: { price: 96890.50, volume_24h: 16500000000, change_24h: 0.14 },
                kraken: { price: 96895.20, volume_24h: 14200000000, change_24h: 0.11 },
                bitget: { price: 96880.30, volume_24h: 12800000000, change_24h: 0.16 },
                kucoin: { price: 96888.90, volume_24h: 11500000000, change_24h: 0.12 }
            },
            best_buy: 'binance',
            best_buy_price: 96873.88,
            best_sell: 'gateio',
            best_sell_price: 96903.70
        },
        'ETH/USDT': {
            symbol: 'ETH/USDT',
            prices: {
                binance: { price: 3352.42, volume_24h: 12500000000, change_24h: 0.23 },
                bybit: { price: 3352.64, volume_24h: 8500000000, change_24h: 0.21 },
                gateio: { price: 3354.00, volume_24h: 7200000000, change_24h: 0.19 },
                okx: { price: 3352.40, volume_24h: 9800000000, change_24h: 0.22 },
                coinbase: { price: 3353.10, volume_24h: 6800000000, change_24h: 0.20 },
                kraken: { price: 3353.50, volume_24h: 5900000000, change_24h: 0.18 },
                bitget: { price: 3352.20, volume_24h: 5200000000, change_24h: 0.24 },
                kucoin: { price: 3352.80, volume_24h: 4800000000, change_24h: 0.21 }
            },
            best_buy: 'okx',
            best_buy_price: 3352.40,
            best_sell: 'gateio',
            best_sell_price: 3354.00
        },
        'SOL/USDT': {
            symbol: 'SOL/USDT',
            prices: {
                binance: { price: 145.39, volume_24h: 3200000000, change_24h: -0.12 },
                bybit: { price: 145.40, volume_24h: 2100000000, change_24h: -0.10 },
                gateio: { price: 145.43, volume_24h: 1800000000, change_24h: -0.08 },
                okx: { price: 145.38, volume_24h: 2400000000, change_24h: -0.11 },
                coinbase: { price: 145.41, volume_24h: 1600000000, change_24h: -0.09 },
                kraken: { price: 145.42, volume_24h: 1400000000, change_24h: -0.10 },
                bitget: { price: 145.37, volume_24h: 1200000000, change_24h: -0.13 },
                kucoin: { price: 145.40, volume_24h: 1100000000, change_24h: -0.11 }
            },
            best_buy: 'okx',
            best_buy_price: 145.38,
            best_sell: 'gateio',
            best_sell_price: 145.43
        },
        'BNB/USDT': {
            symbol: 'BNB/USDT',
            prices: {
                binance: { price: 941.57, volume_24h: 1800000000, change_24h: 0.08 },
                bybit: { price: 941.60, volume_24h: 1200000000, change_24h: 0.09 },
                gateio: { price: 941.60, volume_24h: 1000000000, change_24h: 0.08 },
                okx: { price: 941.80, volume_24h: 1100000000, change_24h: 0.07 },
                coinbase: { price: 941.65, volume_24h: 900000000, change_24h: 0.08 },
                kraken: { price: 941.70, volume_24h: 800000000, change_24h: 0.09 },
                bitget: { price: 941.55, volume_24h: 700000000, change_24h: 0.10 },
                kucoin: { price: 941.62, volume_24h: 650000000, change_24h: 0.08 }
            },
            best_buy: 'binance',
            best_buy_price: 941.57,
            best_sell: 'okx',
            best_sell_price: 941.80
        },
        'XRP/USDT': {
            symbol: 'XRP/USDT',
            prices: {
                binance: { price: 2.11, volume_24h: 2500000000, change_24h: 0.45 },
                bybit: { price: 2.11, volume_24h: 1800000000, change_24h: 0.43 },
                gateio: { price: 2.11, volume_24h: 1500000000, change_24h: 0.44 },
                okx: { price: 2.11, volume_24h: 1900000000, change_24h: 0.45 },
                coinbase: { price: 2.11, volume_24h: 1300000000, change_24h: 0.42 },
                kraken: { price: 2.11, volume_24h: 1200000000, change_24h: 0.44 },
                bitget: { price: 2.11, volume_24h: 1100000000, change_24h: 0.46 },
                kucoin: { price: 2.11, volume_24h: 1000000000, change_24h: 0.44 }
            },
            best_buy: 'binance',
            best_buy_price: 2.11,
            best_sell: 'bitget',
            best_sell_price: 2.11
        },
        'ADA/USDT': {
            symbol: 'ADA/USDT',
            prices: {
                binance: { price: 0.40, volume_24h: 450000000, change_24h: -0.05 },
                bybit: { price: 0.40, volume_24h: 320000000, change_24h: -0.04 },
                gateio: { price: 0.40, volume_24h: 280000000, change_24h: -0.06 },
                okx: { price: 0.40, volume_24h: 340000000, change_24h: -0.05 },
                coinbase: { price: 0.40, volume_24h: 240000000, change_24h: -0.04 },
                kraken: { price: 0.40, volume_24h: 220000000, change_24h: -0.05 },
                bitget: { price: 0.40, volume_24h: 200000000, change_24h: -0.06 },
                kucoin: { price: 0.40, volume_24h: 180000000, change_24h: -0.05 }
            },
            best_buy: 'binance',
            best_buy_price: 0.40,
            best_sell: 'binance',
            best_sell_price: 0.40
        }
    },
    subscriptions: {
        free: {
            name: 'FREE ACCESS',
            features: ['Market pulse every 4 hours', 'Limited signals', 'Public data stream']
        },
        pro: {
            name: 'PRO ACCESS',
            features: ['Market pulse every 2 hours', 'Extended signals', 'Priority data stream']
        },
        premium: {
            name: 'PREMIUM ACCESS',
            features: ['Market pulse every 1 hour', 'Full signal feed', 'Access to private signals chat']
        }
    },
    giveaways: [
        {
            title: '🎁 Premium Subscription Giveaway',
            description: 'Win 1 month of Premium access! Join now and get a chance to win.',
            prize: '1 Month Premium',
            status: 'active'
        },
        {
            title: '💰 $100 USDT Giveaway',
            description: 'Massive giveaway! 10 winners will share $100 USDT.',
            prize: '$100 USDT',
            status: 'active'
        }
    ],
    news: [
        {
            title: '🚨 BTC Major Price Movement',
            content: 'BTC on BINANCE shows +5.23% change in 24h. Current: $96,873.88',
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            title: '💎 ETH Arbitrage Opportunity',
            content: 'ETH shows significant price spread across exchanges. Spread: 1.23%',
            published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            title: '📊 New Exchange Added',
            content: 'We\'ve added Coinbase to our price comparison system. Now tracking 8 exchanges!',
            published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
    ]
};

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    loadSectionData(sectionId);
}

function loadDashboard() {
    const data = DEMO_DATA.dashboard;
    const priceData = DEMO_DATA.priceComparison;
    
    // Update stats cards
    document.getElementById('access-level').textContent = data.subscription_name;
    document.getElementById('signals-today').textContent = data.signals_today;
    document.getElementById('referral-count').textContent = data.referral_count;
    document.getElementById('data-stream').textContent = data.data_stream_status;
    
    // Create price columns dashboard
    const dashboardGrid = document.getElementById('dashboard-grid');
    dashboardGrid.innerHTML = ''; // Clear existing cards
    
    // Add stats row
    const statsRow = document.createElement('div');
    statsRow.className = 'stats-row';
    statsRow.innerHTML = `
        <div class="card">
            <div class="card-title">Access Level</div>
            <div class="card-value">${data.subscription_name}</div>
        </div>
        <div class="card">
            <div class="card-title">Signals Today</div>
            <div class="card-value">${data.signals_today}</div>
        </div>
        <div class="card">
            <div class="card-title">Referrals</div>
            <div class="card-value">${data.referral_count}</div>
        </div>
        <div class="card">
            <div class="card-title">Data Stream</div>
            <div class="card-value">${data.data_stream_status}</div>
        </div>
    `;
    dashboardGrid.appendChild(statsRow);
    
    // Create price columns container
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'price-columns-grid';
    
    // Create price columns for each symbol
    const symbols = Object.keys(priceData).slice(0, 8); // Top 8 symbols
    
    symbols.forEach(symbol => {
        const symbolData = priceData[symbol];
        const symbolShort = symbol.replace('/USDT', '');
        
        // Sort exchanges by price (best to worst)
        const sortedExchanges = Object.entries(symbolData.prices)
            .map(([ex, data]) => ({ exchange: ex, ...data }))
            .sort((a, b) => a.price - b.price); // Sort ascending (lowest = best buy)
        
        // Create column container
        const columnContainer = document.createElement('div');
        columnContainer.className = 'price-column-container';
        
        // Column header
        const columnHeader = document.createElement('div');
        columnHeader.className = 'column-header';
        columnHeader.innerHTML = `
            <div class="symbol-name">${symbolShort}</div>
            <div class="symbol-avg">Avg: $${(sortedExchanges.reduce((sum, ex) => sum + ex.price, 0) / sortedExchanges.length).toFixed(2)}</div>
        `;
        columnContainer.appendChild(columnHeader);
        
        // Price list (sorted from best to worst)
        const priceList = document.createElement('div');
        priceList.className = 'price-list';
        
        sortedExchanges.forEach((exData, index) => {
            const isBest = index === 0;
            const change = exData.change_24h || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeStr = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
            
            const priceItem = document.createElement('div');
            priceItem.className = `price-item ${isBest ? 'best-price' : ''}`;
            priceItem.innerHTML = `
                <div class="exchange-name">${exData.exchange.toUpperCase()}</div>
                <div class="price-value">$${exData.price.toFixed(2)}</div>
                <div class="price-change ${changeClass}">${changeStr}</div>
            `;
            priceList.appendChild(priceItem);
        });
        
        columnContainer.appendChild(priceList);
        columnsContainer.appendChild(columnContainer);
    });
    
    dashboardGrid.appendChild(columnsContainer);
}

function loadMarket() {
    const data = DEMO_DATA.market;
    
    if (data.length === 0) {
        document.getElementById('market-content').innerHTML = '<p style="color: var(--text-secondary);">No market data available</p>';
        return;
    }

    let html = '<table class="market-table"><thead><tr><th>Symbol</th><th>Exchange</th><th>Price</th><th>Change 24h</th><th>Volume</th></tr></thead><tbody>';
    
    data.slice(0, 20).forEach(item => {
        const changeClass = item.change_24h >= 0 ? 'positive' : 'negative';
        const changeStr = item.change_24h >= 0 ? `+${item.change_24h.toFixed(2)}%` : `${item.change_24h.toFixed(2)}%`;
        const volumeStr = formatVolume(item.volume_24h);
        
        html += `<tr>
            <td><strong>${item.symbol}</strong></td>
            <td>${item.exchange}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td class="${changeClass}">${changeStr}</td>
            <td>${volumeStr}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    document.getElementById('market-content').innerHTML = html;
}

function loadPriceComparison() {
    const data = DEMO_DATA.priceComparison;
    
    if (!data || Object.keys(data).length === 0) {
        document.getElementById('price-comparison-content').innerHTML = '<p style="color: var(--text-secondary);">No price comparison data available</p>';
        return;
    }

    const symbols = Object.keys(data).slice(0, 8);
    const exchanges = new Set();
    symbols.forEach(symbol => {
        Object.keys(data[symbol].prices).forEach(ex => exchanges.add(ex));
    });
    const exchangeList = Array.from(exchanges).sort();

    let html = '<div class="comparison-table-wrapper"><table class="market-table comparison-table"><thead><tr><th>Symbol</th>';
    exchangeList.forEach(ex => {
        html += `<th>${ex.toUpperCase()}</th>`;
    });
    html += '</tr></thead><tbody>';

    symbols.forEach(symbol => {
        const symbolData = data[symbol];
        html += `<tr><td><strong>${symbol}</strong></td>`;
        
        exchangeList.forEach(ex => {
            if (symbolData.prices[ex]) {
                const price = symbolData.prices[ex].price;
                const isBest = ex === symbolData.best_buy;
                html += `<td class="${isBest ? 'best-price' : ''}">${isBest ? '🟢 ' : ''}${price.toFixed(2)}</td>`;
            } else {
                html += '<td class="no-data">—</td>';
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    html += '<p style="color: var(--text-secondary); margin-top: 15px; font-size: 0.9em;">🟢 = Best buy price (lowest)</p>';
    html += '<p style="color: var(--text-secondary); font-size: 0.8em; margin-top: 5px;"><i>Demo Mode - Static Data</i></p>';
    document.getElementById('price-comparison-content').innerHTML = html;
}

function loadSubscriptions() {
    const userData = DEMO_DATA.user;
    const currentLevel = userData.subscription_level;
    const levels = ['free', 'pro', 'premium'];
    const levelData = DEMO_DATA.subscriptions;

    let html = '<div class="subscriptions-grid">';
    
    levels.forEach(level => {
        const isCurrent = level === currentLevel;
        const isUpgrade = levels.indexOf(level) > levels.indexOf(currentLevel);
        const levelInfo = levelData[level];
        
        html += `<div class="subscription-card ${isCurrent ? 'current' : ''} ${isUpgrade ? 'upgrade' : ''}">`;
        html += `<div class="subscription-header">`;
        html += `<h3>${levelInfo.name}</h3>`;
        if (isCurrent) {
            html += `<span class="current-badge">CURRENT</span>`;
        }
        html += `</div>`;
        html += `<ul class="features-list">`;
        levelInfo.features.forEach(feature => {
            html += `<li>${feature}</li>`;
        });
        html += `</ul>`;
        if (isUpgrade) {
            html += `<button class="upgrade-btn" onclick="upgradeSubscription('${level}')">Upgrade to ${level.toUpperCase()}</button>`;
        } else if (!isCurrent) {
            html += `<button class="upgrade-btn disabled" disabled>Current Plan</button>`;
        }
        html += `</div>`;
    });
    
    html += '</div>';
    html += '<p style="color: var(--text-secondary); margin-top: 20px; font-size: 0.8em; text-align: center;"><i>Demo Mode - Payments disabled</i></p>';
    document.getElementById('subscriptions-content').innerHTML = html;
}

function upgradeSubscription(level) {
    alert(`Demo Mode: Subscription upgrade to ${level.toUpperCase()} is disabled.\n\nIn production, this would initiate payment flow.`);
}

function loadProfile() {
    const data = DEMO_DATA.user;
    const referralData = DEMO_DATA.referral;
    
    let html = '<div class="profile-info">';
    html += `<div class="profile-row"><span class="profile-label">Username</span><span class="profile-value">${data.username || data.first_name || 'N/A'}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">User ID</span><span class="profile-value">${data.user_id}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Subscription</span><span class="profile-value">${data.subscription_level.toUpperCase()}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Referrals</span><span class="profile-value">${data.referral_count}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Join Date</span><span class="profile-value">${new Date(data.join_date).toLocaleDateString()}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Referral Code</span><span class="profile-value"><code>${referralData.referral_code || 'N/A'}</code></span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Referral Link</span><span class="profile-value"><button class="copy-btn" onclick="copyToClipboard('${referralData.referral_link}')">Copy Link</button></span></div>`;
    html += '</div>';
    html += '<p style="color: var(--text-secondary); margin-top: 20px; font-size: 0.8em; text-align: center;"><i>Demo Mode - Static Data</i></p>';
    
    document.getElementById('profile-content').innerHTML = html;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        if (tg && tg.showToast) {
            tg.showToast('Link copied to clipboard!');
        } else {
            alert('Link copied to clipboard!');
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy link.');
    });
}

function loadGiveaways() {
    const data = DEMO_DATA.giveaways;
    
    if (data.length === 0) {
        document.getElementById('giveaways-content').innerHTML = '<p style="color: var(--text-secondary);">No active giveaways</p>';
        return;
    }

    let html = '';
    data.forEach(giveaway => {
        html += `<div class="signal-item">
            <div class="signal-header">
                <div class="signal-symbol">${giveaway.title}</div>
                <div class="signal-exchange">${giveaway.status.toUpperCase()}</div>
            </div>
            <p style="color: var(--text-secondary); margin-top: 10px;">${giveaway.description || ''}</p>
            <p style="color: var(--neon-green); margin-top: 10px;">Prize: ${giveaway.prize}</p>
        </div>`;
    });
    
    html += '<p style="color: var(--text-secondary); margin-top: 20px; font-size: 0.8em; text-align: center;"><i>Demo Mode - Static Data</i></p>';
    document.getElementById('giveaways-content').innerHTML = html;
}

function loadNews() {
    const data = DEMO_DATA.news;
    
    if (data.length === 0) {
        document.getElementById('news-content').innerHTML = '<p style="color: var(--text-secondary);">No news available</p>';
        return;
    }

    let html = '';
    data.forEach(item => {
        html += `<div class="signal-item">
            <div class="signal-header">
                <div class="signal-symbol">${item.title}</div>
                <div class="signal-exchange">${new Date(item.published_at).toLocaleDateString()}</div>
            </div>
            <p style="color: var(--text-secondary); margin-top: 10px;">${item.content}</p>
        </div>`;
    });
    
    html += '<p style="color: var(--text-secondary); margin-top: 20px; font-size: 0.8em; text-align: center;"><i>Demo Mode - Static Data</i></p>';
    document.getElementById('news-content').innerHTML = html;
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'market':
            loadMarket();
            break;
        case 'price-comparison':
            loadPriceComparison();
            break;
        case 'subscriptions':
            loadSubscriptions();
            break;
        case 'profile':
            loadProfile();
            break;
        case 'giveaways':
            loadGiveaways();
            break;
        case 'news':
            loadNews();
            break;
    }
}

function formatVolume(volume) {
    if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
    if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
    if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
    return volume.toFixed(2);
}

// Initialize dashboard on load
loadDashboard();
