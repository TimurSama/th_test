// TokenHunter Mini App

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const userId = tg.initDataUnsafe?.user?.id || Math.floor(Math.random() * 1000000);

// Market data
const MARKET_DATA = {
    user: {
        user_id: userId,
        username: tg.initDataUnsafe?.user?.username || 'User',
        first_name: tg.initDataUnsafe?.user?.first_name || 'User',
        subscription_level: 'premium',
        join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        referral_count: 12
    },
    referral: {
        referral_code: 'REF' + userId.toString().slice(-4),
        referral_count: 12,
        referral_link: `https://t.me/your_bot?start=ref_REF${userId.toString().slice(-4)}`
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
            id: 1,
            title: '🎁 Розыгрыш за активных друзей',
            description: 'Пригласи 5 друзей на уровень PRO и участвуй в розыгрыше 200 USDT. 5 случайных участников получат по 40 USDT.',
            prize: '200 USDT (5 победителей)',
            status: 'active',
            type: 'referral_pro',
            requirement: 'Пригласить 5 друзей с подпиской PRO',
            participants: 127,
            ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            title: '📢 Розыгрыш за подписку',
            description: 'Подпишись на новостной канал и чат канал TokenHunter. 10 случайных участников получат по 10 USDT.',
            prize: '100 USDT (10 победителей)',
            status: 'active',
            type: 'subscription',
            requirement: 'Подписка на новостной канал и чат канал',
            participants: 89,
            ends_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
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

function createMatrixRain(container, duration = 2000) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%&*';
    const charCount = 50;
    
    for (let i = 0; i < charCount; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDelay = Math.random() * 2 + 's';
        char.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(char);
    }
    
    setTimeout(() => {
        container.innerHTML = '';
    }, duration);
}

function loadDashboard() {
    try {
        const data = MARKET_DATA.dashboard;
        const priceData = MARKET_DATA.priceComparison;
        
        // Create price columns dashboard
        const dashboardGrid = document.getElementById('dashboard-grid');
        if (!dashboardGrid) {
            console.error('Dashboard grid not found');
            return;
        }
        
        // Add loading animation
        dashboardGrid.classList.add('loading');
        
        // Create matrix rain overlay
        const matrixOverlay = document.createElement('div');
        matrixOverlay.className = 'matrix-overlay';
        document.body.appendChild(matrixOverlay);
        createMatrixRain(matrixOverlay, 2000);
        
        // Clear content after animation starts
        setTimeout(() => {
            dashboardGrid.innerHTML = ''; // Clear existing content
            dashboardGrid.classList.remove('loading');
    
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
            priceItem.style.opacity = '0';
            priceItem.style.transform = 'translateY(-30px)';
            priceItem.innerHTML = `
                <div class="exchange-name">${exData.exchange.toUpperCase()}</div>
                <div class="price-value">$${exData.price.toFixed(2)}</div>
                <div class="price-change ${changeClass}">${changeStr}</div>
            `;
            priceList.appendChild(priceItem);
            
            // Animate item appearing
            setTimeout(() => {
                priceItem.style.transition = 'all 0.4s ease-out';
                priceItem.style.opacity = '1';
                priceItem.style.transform = 'translateY(0)';
            }, 50 * index);
        });
        
        columnContainer.appendChild(priceList);
        columnsContainer.appendChild(columnContainer);
    });
    
            dashboardGrid.appendChild(columnsContainer);
            
            // Animate columns appearing
            const columns = columnsContainer.querySelectorAll('.price-column-container');
            columns.forEach((col, index) => {
                col.style.opacity = '0';
                col.style.transform = 'translateY(-50px)';
                setTimeout(() => {
                    col.style.transition = 'all 0.6s ease-out';
                    col.style.opacity = '1';
                    col.style.transform = 'translateY(0)';
                }, 100 * index);
            });
            
            // Remove matrix overlay after animation
            setTimeout(() => {
                if (matrixOverlay.parentNode) {
                    matrixOverlay.parentNode.removeChild(matrixOverlay);
                }
            }, 2500);
        }, 500);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        const dashboardGrid = document.getElementById('dashboard-grid');
        if (dashboardGrid) {
            dashboardGrid.classList.remove('loading');
            dashboardGrid.innerHTML = '<p style="color: #ff4444;">Error loading dashboard data</p>';
        }
    }
}

function loadMarket() {
    const data = MARKET_DATA.market;
    
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
    const data = MARKET_DATA.priceComparison;
    
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
    document.getElementById('price-comparison-content').innerHTML = html;
}

function loadSubscriptions() {
    const userData = MARKET_DATA.user;
    const currentLevel = userData.subscription_level;
    const levels = ['free', 'pro', 'premium'];
    const levelData = MARKET_DATA.subscriptions;

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
    document.getElementById('subscriptions-content').innerHTML = html;
}

function upgradeSubscription(level) {
    if (tg && tg.showAlert) {
        tg.showAlert(`Upgrade to ${level.toUpperCase()} subscription?`);
    } else {
        alert(`Upgrade to ${level.toUpperCase()} subscription?`);
    }
}

function loadProfile() {
    const data = MARKET_DATA.user;
    const referralData = MARKET_DATA.referral;
    
    let html = '<div class="profile-info">';
    html += `<div class="profile-row"><span class="profile-label">Username</span><span class="profile-value">${data.username || data.first_name || 'N/A'}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">User ID</span><span class="profile-value">${data.user_id}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Subscription</span><span class="profile-value">${data.subscription_level.toUpperCase()}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Referrals</span><span class="profile-value">${data.referral_count}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Join Date</span><span class="profile-value">${new Date(data.join_date).toLocaleDateString()}</span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Referral Code</span><span class="profile-value"><code>${referralData.referral_code || 'N/A'}</code></span></div>`;
    html += `<div class="profile-row"><span class="profile-label">Referral Link</span><span class="profile-value"><button class="copy-btn" onclick="copyToClipboard('${referralData.referral_link}')">Copy Link</button></span></div>`;
    html += '</div>';
    
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
    const data = MARKET_DATA.giveaways;
    
    if (data.length === 0) {
        document.getElementById('giveaways-content').innerHTML = '<p style="color: var(--text-secondary);">No active giveaways</p>';
        return;
    }

    let html = '';
    data.forEach(giveaway => {
        const endDate = new Date(giveaway.ends_at);
        const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
        
        html += `<div class="signal-item giveaway-item">
            <div class="signal-header">
                <div class="signal-symbol">${giveaway.title}</div>
                <div class="signal-exchange">${daysLeft} дней</div>
            </div>
            <p style="color: var(--text-secondary); margin-top: 10px;">${giveaway.description || ''}</p>
            <div style="margin-top: 15px; padding: 10px; background: var(--bg-darker); border-left: 3px solid var(--neon-green);">
                <p style="color: var(--neon-green); font-weight: bold; margin-bottom: 5px;">Приз: ${giveaway.prize}</p>
                <p style="color: var(--text-secondary); font-size: 0.9em; margin-bottom: 5px;">Условие: ${giveaway.requirement}</p>
                <p style="color: var(--text-secondary); font-size: 0.85em;">Участников: ${giveaway.participants}</p>
            </div>
            <button class="upgrade-btn" style="margin-top: 15px; width: 100%;" onclick="participateGiveaway(${giveaway.id})">Участвовать</button>
        </div>`;
    });
    
    document.getElementById('giveaways-content').innerHTML = html;
}

function participateGiveaway(giveawayId) {
    if (tg && tg.showAlert) {
        tg.showAlert('Участие в розыгрыше подтверждено!');
    } else {
        alert('Участие в розыгрыше подтверждено!');
    }
}

function loadNews() {
    const data = MARKET_DATA.news;
    
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
    
    document.getElementById('news-content').innerHTML = html;
}

function loadPartnership() {
    let html = '<div class="partnership-info">';
    html += '<div class="partnership-section">';
    html += '<h3 style="color: var(--neon-green); margin-bottom: 15px;">Для инфлюенсеров и блогеров</h3>';
    html += '<p style="color: var(--text-secondary); margin-bottom: 20px;">Станьте партнером TokenHunter и получайте комиссию за каждого привлеченного пользователя.</p>';
    html += '<ul class="features-list" style="margin-bottom: 20px;">';
    html += '<li>Уникальная реферальная ссылка</li>';
    html += '<li>Отслеживание конверсий в реальном времени</li>';
    html += '<li>Выплаты каждую неделю</li>';
    html += '<li>Персональная поддержка</li>';
    html += '</ul>';
    html += '<button class="upgrade-btn" onclick="contactPartnership()">Связаться с нами</button>';
    html += '</div>';
    
    html += '<div class="partnership-section" style="margin-top: 30px;">';
    html += '<h3 style="color: var(--neon-green); margin-bottom: 15px;">Для трейдеров</h3>';
    html += '<p style="color: var(--text-secondary); margin-bottom: 20px;">Публикуйте свои сигналы и аналитику в TokenHunter. Получайте подписчиков и монетизируйте свой опыт.</p>';
    html += '<ul class="features-list" style="margin-bottom: 20px;">';
    html += '<li>Публикация торговых сигналов</li>';
    html += '<li>Аналитика и прогнозы</li>';
    html += '<li>Монетизация контента</li>';
    html += '<li>Статистика и аналитика</li>';
    html += '</ul>';
    html += '<button class="upgrade-btn" onclick="contactPartnership()">Стать трейдером</button>';
    html += '</div>';
    
    html += '<div class="partnership-section" style="margin-top: 30px; padding: 20px; background: var(--bg-darker); border: 1px solid var(--neon-green);">';
    html += '<h3 style="color: var(--neon-green); margin-bottom: 15px;">Контакты</h3>';
    html += '<p style="color: var(--text-secondary);">Email: partners@tokenhunter.net</p>';
    html += '<p style="color: var(--text-secondary);">Telegram: @tokenhunter_partners</p>';
    html += '</div>';
    
    html += '</div>';
    document.getElementById('partnership-content').innerHTML = html;
}

function contactPartnership() {
    if (tg && tg.openTelegramLink) {
        tg.openTelegramLink('https://t.me/tokenhunter_partners');
    } else {
        window.open('https://t.me/tokenhunter_partners', '_blank');
    }
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
        case 'partnership':
            loadPartnership();
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

// Auto-update prices with Matrix animation
let priceUpdateInterval = null;

function startPriceUpdates() {
    // Simulate price changes for demo (in production, this would fetch real data)
    function simulatePriceChanges() {
        // Randomly modify prices slightly
        Object.keys(MARKET_DATA.priceComparison).forEach(symbol => {
            Object.keys(MARKET_DATA.priceComparison[symbol].prices).forEach(exchange => {
                const priceData = MARKET_DATA.priceComparison[symbol].prices[exchange];
                const change = (Math.random() - 0.5) * 0.1; // ±0.05% change
                priceData.price = priceData.price * (1 + change);
                priceData.change_24h = (priceData.change_24h || 0) + change;
            });
        });
        
        // Update market data too
        MARKET_DATA.market.forEach(item => {
            const change = (Math.random() - 0.5) * 0.1;
            item.price = item.price * (1 + change);
            item.change_24h = (item.change_24h || 0) + change;
        });
    }
    
    // Update prices every 10 seconds with Matrix animation
    priceUpdateInterval = setInterval(() => {
        simulatePriceChanges();
        updateDashboardPrices();
        updateMarketPrices();
    }, 10000);
}

function updateDashboardPrices() {
    const priceData = MARKET_DATA.priceComparison;
    const columns = document.querySelectorAll('.price-column-container');
    
    columns.forEach(column => {
        const symbolName = column.querySelector('.symbol-name');
        if (!symbolName) return;
        
        const symbol = symbolName.textContent + '/USDT';
        if (!priceData[symbol]) return;
        
        const symbolData = priceData[symbol];
        const sortedExchanges = Object.entries(symbolData.prices)
            .map(([ex, data]) => ({ exchange: ex, ...data }))
            .sort((a, b) => a.price - b.price);
        
        const priceItems = column.querySelectorAll('.price-item');
        priceItems.forEach((item, index) => {
            const exchangeName = item.querySelector('.exchange-name');
            if (!exchangeName) return;
            
            const exchange = exchangeName.textContent.toLowerCase();
            const exchangeData = sortedExchanges.find(ex => ex.exchange === exchange);
            
            if (exchangeData) {
                const priceValue = item.querySelector('.price-value');
                const priceChange = item.querySelector('.price-change');
                
                if (priceValue) {
                    const oldPrice = priceValue.textContent;
                    const newPrice = `$${exchangeData.price.toFixed(2)}`;
                    if (oldPrice !== newPrice) {
                        animatePriceUpdate(priceValue, oldPrice, newPrice);
                    }
                }
                
                if (priceChange) {
                    const change = exchangeData.change_24h || 0;
                    const changeClass = change >= 0 ? 'positive' : 'negative';
                    const changeStr = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
                    const oldChange = priceChange.textContent;
                    
                    if (oldChange !== changeStr) {
                        priceChange.className = `price-change ${changeClass}`;
                        animatePriceUpdate(priceChange, oldChange, changeStr);
                    }
                }
                
                item.classList.add('updating');
                setTimeout(() => {
                    item.classList.remove('updating');
                }, 600);
            }
        });
    });
}

function updateMarketPrices() {
    const data = MARKET_DATA.market;
    const rows = document.querySelectorAll('.market-row');
    
    rows.forEach(row => {
        const symbolCell = row.querySelector('td:first-child strong');
        const exchangeCell = row.querySelector('td:nth-child(2)');
        if (!symbolCell || !exchangeCell) return;
        
        const symbol = symbolCell.textContent;
        const exchange = exchangeCell.textContent.toLowerCase();
        const marketItem = data.find(item => 
            item.symbol === symbol && item.exchange === exchange
        );
        
        if (marketItem) {
            const priceCell = row.querySelector('.price-cell');
            const changeCell = row.querySelector('.positive, .negative');
            
            if (priceCell) {
                const oldPrice = priceCell.textContent;
                const newPrice = `$${marketItem.price.toFixed(2)}`;
                if (oldPrice !== newPrice) {
                    animatePriceUpdate(priceCell, oldPrice, newPrice);
                }
            }
            
            if (changeCell) {
                const change = marketItem.change_24h;
                const changeClass = change >= 0 ? 'positive' : 'negative';
                const changeStr = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
                const oldChange = changeCell.textContent;
                
                if (oldChange !== changeStr) {
                    changeCell.className = changeClass;
                    animatePriceUpdate(changeCell, oldChange, changeStr);
                }
            }
        }
    });
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            loadDashboard();
            startPriceUpdates();
        }, 100);
    });
} else {
    setTimeout(() => {
        loadDashboard();
        startPriceUpdates();
    }, 100);
}

// Initialize dashboard on load
loadDashboard();
