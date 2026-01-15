const API_BASE = (typeof CONFIG !== 'undefined' && CONFIG.API_BASE) 
    ? CONFIG.API_BASE 
    : (window.location.origin.includes('github.io') 
        ? 'https://your-api-server.com' 
        : window.location.origin);

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const userId = tg.initDataUnsafe?.user?.id;

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

async function loadDashboard() {
    if (!userId) {
        document.getElementById('dashboard-grid').innerHTML = '<p style="color: var(--text-secondary); text-align: center;">User ID not available</p>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/dashboard/${userId}`);
        const data = await response.json();
        
        document.getElementById('access-level').textContent = data.subscription_name;
        document.getElementById('signals-today').textContent = data.signals_today;
        document.getElementById('referral-count').textContent = data.referral_count;
        document.getElementById('data-stream').textContent = data.data_stream_status;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('access-level').textContent = 'ERROR';
    }
}

async function loadMarket() {
    try {
        const response = await fetch(`${API_BASE}/api/market-pulse`);
        const data = await response.json();
        
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
    } catch (error) {
        console.error('Error loading market:', error);
        document.getElementById('market-content').innerHTML = '<p style="color: #ff4444;">Error loading market data</p>';
    }
}

async function loadPriceComparison() {
    try {
        const response = await fetch(`${API_BASE}/api/price-comparison`);
        const data = await response.json();
        
        if (!data || Object.keys(data).length === 0) {
            document.getElementById('price-comparison-content').innerHTML = '<p style="color: var(--text-secondary);">No price comparison data available</p>';
            return;
        }

        const symbols = Object.keys(data).slice(0, 10);
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
    } catch (error) {
        console.error('Error loading price comparison:', error);
        document.getElementById('price-comparison-content').innerHTML = '<p style="color: #ff4444;">Error loading price comparison</p>';
    }
}

async function loadSubscriptions() {
    if (!userId) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/user/${userId}`);
        const userData = await response.json();
        
        const currentLevel = userData.subscription_level;
        const levels = ['free', 'pro', 'premium'];
        const levelNames = {
            'free': 'FREE ACCESS',
            'pro': 'PRO ACCESS',
            'premium': 'PREMIUM ACCESS'
        };
        const levelFeatures = {
            'free': ['Market pulse every 4 hours', 'Limited signals', 'Public data stream'],
            'pro': ['Market pulse every 2 hours', 'Extended signals', 'Priority data stream'],
            'premium': ['Market pulse every 1 hour', 'Full signal feed', 'Access to private signals chat']
        };

        let html = '<div class="subscriptions-grid">';
        
        levels.forEach(level => {
            const isCurrent = level === currentLevel;
            const isUpgrade = levels.indexOf(level) > levels.indexOf(currentLevel);
            
            html += `<div class="subscription-card ${isCurrent ? 'current' : ''} ${isUpgrade ? 'upgrade' : ''}">`;
            html += `<div class="subscription-header">`;
            html += `<h3>${levelNames[level]}</h3>`;
            if (isCurrent) {
                html += `<span class="current-badge">CURRENT</span>`;
            }
            html += `</div>`;
            html += `<ul class="features-list">`;
            levelFeatures[level].forEach(feature => {
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
    } catch (error) {
        console.error('Error loading subscriptions:', error);
    }
}

async function upgradeSubscription(level) {
    if (!userId) return;
    
    if (!confirm(`Upgrade to ${level.toUpperCase()} subscription?`)) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/subscription/upgrade`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id: userId, level: level})
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Subscription upgraded successfully!');
            loadSubscriptions();
            loadDashboard();
        } else {
            alert('Error: ' + (result.error || 'Failed to upgrade'));
        }
    } catch (error) {
        console.error('Error upgrading subscription:', error);
        alert('Error upgrading subscription');
    }
}

async function loadProfile() {
    if (!userId) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/user/${userId}`);
        const data = await response.json();
        
        const referralResponse = await fetch(`${API_BASE}/api/referral/${userId}`);
        const referralData = await referralResponse.json();
        
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
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

async function loadGiveaways() {
    try {
        const response = await fetch(`${API_BASE}/api/giveaways?status=active`);
        const data = await response.json();
        
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
        
        document.getElementById('giveaways-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading giveaways:', error);
    }
}

async function loadNews() {
    try {
        const response = await fetch(`${API_BASE}/api/news`);
        const data = await response.json();
        
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
    } catch (error) {
        console.error('Error loading news:', error);
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

if (userId) {
    loadDashboard();
}

