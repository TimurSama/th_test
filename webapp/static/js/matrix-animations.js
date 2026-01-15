// Matrix-style update animations for price values

function animatePriceUpdate(element, oldValue, newValue) {
    if (!element) return;
    
    // Create flowing effect
    const flow = document.createElement('div');
    flow.style.position = 'absolute';
    flow.style.top = '-30px';
    flow.style.left = '0';
    flow.style.color = 'var(--neon-green)';
    flow.style.fontSize = 'inherit';
    flow.style.fontWeight = 'bold';
    flow.style.opacity = '0.8';
    flow.style.pointerEvents = 'none';
    flow.style.zIndex = '10';
    flow.textContent = newValue;
    flow.style.animation = 'matrixUpdate 0.6s ease-out';
    
    element.style.position = 'relative';
    element.appendChild(flow);
    
    // Update value
    setTimeout(() => {
        element.textContent = newValue;
        flow.style.animation = 'matrixFlowDown 0.4s ease-in forwards';
        setTimeout(() => {
            if (flow.parentNode) {
                flow.parentNode.removeChild(flow);
            }
        }, 400);
    }, 300);
}

function updatePriceWithAnimation(container, exchange, newPrice, newChange) {
    const items = container.querySelectorAll('.price-item');
    items.forEach(item => {
        const exchangeName = item.querySelector('.exchange-name');
        if (exchangeName && exchangeName.textContent === exchange.toUpperCase()) {
            const priceValue = item.querySelector('.price-value');
            const priceChange = item.querySelector('.price-change');
            
            if (priceValue) {
                const oldPrice = priceValue.textContent;
                animatePriceUpdate(priceValue, oldPrice, `$${newPrice.toFixed(2)}`);
            }
            
            if (priceChange) {
                const changeClass = newChange >= 0 ? 'positive' : 'negative';
                const changeStr = newChange >= 0 ? `+${newChange.toFixed(2)}%` : `${newChange.toFixed(2)}%`;
                priceChange.className = `price-change ${changeClass}`;
                animatePriceUpdate(priceChange, priceChange.textContent, changeStr);
            }
            
            // Add update animation to item
            item.classList.add('updating');
            setTimeout(() => {
                item.classList.remove('updating');
            }, 600);
        }
    });
}

