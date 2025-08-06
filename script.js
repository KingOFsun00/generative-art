// Configuration
const CONFIG = {
    unsplashAccessKey: 'AFHvJmJON5UsXS5uhW1x9y2omkl4dIUhJJYTc38j5gc',
    randomThemes: [
        'mystical forest with glowing mushrooms',
        'cyberpunk neon cityscape at night',
        'ancient temple in misty mountains',
        'underwater coral reef paradise',
        'space nebula with distant galaxies',
        'japanese zen garden in autumn',
        'steampunk clockwork machinery',
        'aurora borealis over frozen lake',
        'desert oasis with palm trees',
        'floating islands in the clouds',
        'bioluminescent deep sea creatures',
        'medieval castle on cliff edge',
        'abstract geometric patterns',
        'vintage art deco architecture',
        'tropical rainforest canopy'
    ],
    artisticEffects: [
        { id: 'impressionist', name: 'Impressionista', icon: '🎨' },
        { id: 'watercolor', name: 'Aquarela', icon: '💧' },
        { id: 'oil-painting', name: 'Pintura a Óleo', icon: '🖌️' },
        { id: 'digital-glitch', name: 'Glitch Digital', icon: '⚡' },
        { id: 'mosaic', name: 'Mosaico', icon: '🔷' },
        { id: 'sketch', name: 'Esboço', icon: '✏️' },
        { id: 'pop-art', name: 'Pop Art', icon: '🎭' },
        { id: 'abstract', name: 'Abstrato', icon: '🌀' }
    ],
    quickThemes: [
        'Floresta Mística',
        'Cidade Cyberpunk', 
        'Oceano Profundo',
        'Espaço Sideral',
        'Arte Abstrata'
    ]
};

// Application State
const state = {
    currentImage: null,
    currentTheme: '',
    isGenerating: false,
    settings: {
        effect: 'impressionist',
        intensity: 50,
        colorVariance: 30,
        brushSize: 15,
        complexity: 60
    },
    artworkHistory: [],
    likes: 0,
    views: 0
};

// DOM Elements
const elements = {
    canvas: null,
    ctx: null,
    searchInput: null,
    generateBtn: null,
    saveBtn: null,
    randomBtn: null,
    shareBtn: null,
    likeBtn: null,
    loadingOverlay: null,
    effectsGrid: null,
    sliders: {},
    statsContainer: null,
    historyCard: null,
    historyGrid: null,
    themesContainer: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeCanvas();
    setupEventListeners();
    populateEffects();
    populateThemes();
    setupSliders();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Load saved preferences
    loadPreferences();
});

function initializeElements() {
    elements.canvas = document.getElementById('artCanvas');
    elements.ctx = elements.canvas.getContext('2d');
    elements.searchInput = document.getElementById('searchInput');
    elements.generateBtn = document.getElementById('generateBtn');
    elements.saveBtn = document.getElementById('saveBtn');
    elements.randomBtn = document.getElementById('randomBtn');
    elements.shareBtn = document.getElementById('shareBtn');
    elements.likeBtn = document.getElementById('likeBtn');
    elements.loadingOverlay = document.getElementById('loadingOverlay');
    elements.effectsGrid = document.getElementById('effectsGrid');
    elements.statsContainer = document.getElementById('statsContainer');
    elements.historyCard = document.getElementById('historyCard');
    elements.historyGrid = document.getElementById('historyGrid');
    elements.themesContainer = document.getElementById('themesContainer');
    
    // Sliders
    elements.sliders = {
        intensity: document.getElementById('intensitySlider'),
        colorVariance: document.getElementById('colorVarianceSlider'),
        brushSize: document.getElementById('brushSizeSlider'),
        complexity: document.getElementById('complexitySlider')
    };
}

function initializeCanvas() {
    const size = Math.min(600, window.innerWidth - 80);
    elements.canvas.width = size;
    elements.canvas.height = size;
    drawPlaceholder();
}

function drawPlaceholder() {
    const { ctx, canvas } = elements;
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Decorative border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Text
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Sua Arte Será Criada Aqui ✨', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '16px Inter, system-ui';
    ctx.fillText('Digite um tema e clique em "Gerar Arte"', canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.setLineDash([]);
}

function setupEventListeners() {
    // Generation events
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGenerate();
    });
    
    // Action buttons
    elements.saveBtn.addEventListener('click', saveArtwork);
    elements.randomBtn.addEventListener('click', generateRandomTheme);
    elements.shareBtn.addEventListener('click', shareArtwork);
    elements.likeBtn.addEventListener('click', likeArtwork);
    
    // Window resize
    window.addEventListener('resize', () => {
        initializeCanvas();
        if (state.currentImage) {
            applyArtisticEffects(state.currentImage);
        }
    });
}

function setupSliders() {
    Object.keys(elements.sliders).forEach(key => {
        const slider = elements.sliders[key];
        const valueElement = document.getElementById(`${key}Value`);
        
        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            state.settings[key] = value;
            valueElement.textContent = value;
            
            if (state.currentImage) {
                applyArtisticEffects(state.currentImage);
            }
            
            savePreferences();
        });
    });
}

function populateEffects() {
    CONFIG.artisticEffects.forEach(effect => {
        const button = document.createElement('button');
        button.className = `effect-btn ${effect.id === state.settings.effect ? 'active' : ''}`;
        button.innerHTML = `
            <span>${effect.icon}</span>
            <span>${effect.name}</span>
        `;
        
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.effect-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update state
            state.settings.effect = effect.id;
            
            // Apply effect if image exists
            if (state.currentImage) {
                applyArtisticEffects(state.currentImage);
            }
            
            savePreferences();
        });
        
        elements.effectsGrid.appendChild(button);
    });
}

function populateThemes() {
    CONFIG.quickThemes.forEach(theme => {
        const badge = document.createElement('button');
        badge.className = 'theme-badge';
        badge.textContent = theme;
        
        badge.addEventListener('click', () => {
            elements.searchInput.value = theme.toLowerCase();
            handleGenerate();
        });
        
        elements.themesContainer.appendChild(badge);
    });
}

async function handleGenerate() {
    const query = elements.searchInput.value.trim();
    if (!query || state.isGenerating) return;
    
    try {
        state.currentTheme = query;
        showLoading(true);
        
        const imageUrl = await fetchUnsplashImage(query);
        state.currentImage = imageUrl;
        await applyArtisticEffects(imageUrl);
        
        // Update stats
        state.views++;
        updateStats();
        
        // Add to history
        addToHistory();
        
        showToast('Arte criada com sucesso!', `Efeito ${getCurrentEffectName()} aplicado.`, 'success');
        
    } catch (error) {
        console.error('Erro ao gerar arte:', error);
        showToast('Erro ao gerar arte', 'Tente outro tema ou verifique sua conexão.', 'error');
    } finally {
        showLoading(false);
    }
}

async function fetchUnsplashImage(query) {
    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&client_id=${CONFIG.unsplashAccessKey}`
    );
    
    if (!response.ok) {
        throw new Error('Falha ao buscar imagens');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
        throw new Error('Nenhuma imagem encontrada para este tema');
    }
    
    // Select random image from results
    const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length));
    return data.results[randomIndex].urls.regular;
}

async function applyArtisticEffects(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            // Calculate dimensions maintaining aspect ratio
            const ratio = Math.min(
                elements.canvas.width / img.width,
                elements.canvas.height / img.height
            );
            const newWidth = img.width * ratio;
            const newHeight = img.height * ratio;
            
            // Clear and draw base image
            elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
            elements.ctx.drawImage(
                img,
                (elements.canvas.width - newWidth) / 2,
                (elements.canvas.height - newHeight) / 2,
                newWidth,
                newHeight
            );
            
            // Apply artistic effect
            applyArtisticEffect(elements.ctx, elements.canvas, state.settings.effect, state.settings);
            
            resolve();
        };
        
        img.src = imageUrl;
    });
}

function applyArtisticEffect(ctx, canvas, effect, settings) {
    const { intensity, colorVariance, brushSize, complexity } = settings;
    
    switch (effect) {
        case 'impressionist':
            applyImpressionistEffect(ctx, canvas, intensity, colorVariance, brushSize);
            break;
        case 'watercolor':
            applyWatercolorEffect(ctx, canvas, intensity, colorVariance);
            break;
        case 'oil-painting':
            applyOilPaintingEffect(ctx, canvas, intensity, brushSize);
            break;
        case 'digital-glitch':
            applyGlitchEffect(ctx, canvas, intensity, complexity);
            break;
        case 'mosaic':
            applyMosaicEffect(ctx, canvas, brushSize, colorVariance);
            break;
        case 'sketch':
            applySketchEffect(ctx, canvas, intensity, complexity);
            break;
        case 'pop-art':
            applyPopArtEffect(ctx, canvas, colorVariance, intensity);
            break;
        case 'abstract':
            applyAbstractEffect(ctx, canvas, complexity, colorVariance);
            break;
    }
}

// Artistic Effect Functions
function applyImpressionistEffect(ctx, canvas, intensity, colorVariance, brushSize) {
    const strokeCount = 200 + intensity * 5;
    const maxBrushSize = brushSize + intensity * 0.5;
    
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.1 + intensity * 0.005;
    
    for (let i = 0; i < strokeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * maxBrushSize + 5;
        
        // Get pixel color
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        
        // Apply color variance
        const hueShift = (Math.random() - 0.5) * colorVariance * 2;
        const [h, s, l] = rgbToHsl(r, g, b);
        const [nr, ng, nb] = hslToRgb((h + hueShift / 360) % 1, s, l);
        
        ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`;
        
        // Create brush stroke
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
}

function applyWatercolorEffect(ctx, canvas, intensity, colorVariance) {
    const blobs = 50 + intensity;
    
    ctx.globalCompositeOperation = 'multiply';
    
    for (let i = 0; i < blobs; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 20 + Math.random() * (intensity * 2);
        
        // Get base color
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        
        // Create gradient for bleeding effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        const alpha = 0.1 + intensity * 0.003;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'source-over';
}

function applyOilPaintingEffect(ctx, canvas, intensity, brushSize) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data);
    
    const radius = Math.max(1, brushSize / 5);
    
    for (let y = radius; y < canvas.height - radius; y += 2) {
        for (let x = radius; x < canvas.width - radius; x += 2) {
            let totalR = 0, totalG = 0, totalB = 0, count = 0;
            
            // Sample surrounding pixels
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const pixelIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
                    totalR += data[pixelIndex];
                    totalG += data[pixelIndex + 1];
                    totalB += data[pixelIndex + 2];
                    count++;
                }
            }
            
            // Apply averaged color to area
            const avgR = totalR / count;
            const avgG = totalG / count;
            const avgB = totalB / count;
            
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const pixelIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
                    if (pixelIndex >= 0 && pixelIndex < newData.length) {
                        newData[pixelIndex] = avgR;
                        newData[pixelIndex + 1] = avgG;
                        newData[pixelIndex + 2] = avgB;
                    }
                }
            }
        }
    }
    
    const newImageData = new ImageData(newData, canvas.width, canvas.height);
    ctx.putImageData(newImageData, 0, 0);
}

function applyGlitchEffect(ctx, canvas, intensity, complexity) {
    const glitchLines = Math.floor(complexity / 10);
    
    for (let i = 0; i < glitchLines; i++) {
        const y = Math.random() * canvas.height;
        const height = 1 + Math.random() * (intensity / 10);
        const offset = (Math.random() - 0.5) * (intensity / 2);
        
        const imageData = ctx.getImageData(0, y, canvas.width, height);
        ctx.putImageData(imageData, offset, y);
    }
    
    // Add color channel shifting
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < intensity / 1000) {
            const shift = Math.floor((Math.random() - 0.5) * intensity);
            data[i] = Math.min(255, Math.max(0, data[i] + shift)); // R
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] - shift)); // B
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyMosaicEffect(ctx, canvas, tileSize, colorVariance) {
    const size = Math.max(5, tileSize / 3);
    
    for (let y = 0; y < canvas.height; y += size) {
        for (let x = 0; x < canvas.width; x += size) {
            // Get average color of tile area
            const imageData = ctx.getImageData(x, y, Math.min(size, canvas.width - x), Math.min(size, canvas.height - y));
            const data = imageData.data;
            
            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }
            
            if (count > 0) {
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                
                // Apply color variance
                const variance = colorVariance / 100;
                r = Math.min(255, Math.max(0, r + (Math.random() - 0.5) * 255 * variance));
                g = Math.min(255, Math.max(0, g + (Math.random() - 0.5) * 255 * variance));
                b = Math.min(255, Math.max(0, b + (Math.random() - 0.5) * 255 * variance));
                
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, y, size, size);
                
                // Add tile border
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(x, y, size, size);
            }
        }
    }
}

function applySketchEffect(ctx, canvas, intensity, complexity) {
    // Convert to grayscale first
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add sketch lines
    ctx.globalCompositeOperation = 'multiply';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    
    const lineCount = complexity * 2;
    
    for (let i = 0; i < lineCount; i++) {
        const x1 = Math.random() * canvas.width;
        const y1 = Math.random() * canvas.height;
        const length = 10 + Math.random() * (intensity / 2);
        const angle = Math.random() * Math.PI * 2;
        
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    ctx.globalCompositeOperation = 'source-over';
}

function applyPopArtEffect(ctx, canvas, colorVariance, intensity) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Posterize colors
    const levels = Math.max(2, 8 - Math.floor(intensity / 20));
    const factor = 255 / (levels - 1);
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(data[i] / factor) * factor; // R
        data[i + 1] = Math.round(data[i + 1] / factor) * factor; // G
        data[i + 2] = Math.round(data[i + 2] / factor) * factor; // B
        
        // Boost saturation
        const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
        const newS = Math.min(1, s * (1 + colorVariance / 100));
        const [r, g, b] = hslToRgb(h, newS, l);
        
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyAbstractEffect(ctx, canvas, complexity, colorVariance) {
    ctx.globalCompositeOperation = 'overlay';
    
    const shapeCount = complexity;
    
    for (let i = 0; i < shapeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 100 + 20;
        
        // Get base color and modify
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        const [h, s, l] = rgbToHsl(r, g, b);
        
        const newH = (h + ((Math.random() - 0.5) * colorVariance) / 100) % 1;
        const [nr, ng, nb] = hslToRgb(newH, Math.min(1, s * 1.5), l);
        
        ctx.fillStyle = `rgba(${nr}, ${ng}, ${nb}, 0.3)`;
        
        // Random shapes
        const shapeType = Math.floor(Math.random() * 3);
        ctx.beginPath();
        
        switch (shapeType) {
            case 0: // Circle
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                break;
            case 1: // Rectangle
                ctx.rect(x - size / 2, y - size / 2, size, size);
                break;
            case 2: // Triangle
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x + size / 2, y + size / 2);
                ctx.lineTo(x - size / 2, y + size / 2);
                break;
        }
        
        ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'source-over';
}

// Color conversion utilities
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Utility Functions
function generateRandomTheme() {
    const randomTheme = CONFIG.randomThemes[Math.floor(Math.random() * CONFIG.randomThemes.length)];
    elements.searchInput.value = randomTheme;
    handleGenerate();
}

function saveArtwork() {
    if (!state.currentImage) return;
    
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = state.currentTheme 
        ? `arte-${state.currentTheme.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`
        : `arte-generativa-${timestamp}`;
    
    link.download = `${filename}.png`;
    link.href = elements.canvas.toDataURL('image/png');
    link.click();
    
    showToast('Artwork salvo!', 'Sua obra de arte foi baixada com sucesso.', 'success');
}

function shareArtwork() {
    if (navigator.share) {
        navigator.share({
            title: `Arte Generativa: ${state.currentTheme}`,
            text: 'Confira esta obra de arte generativa que criei!',
            url: window.location.href
        }).catch(err => {
            console.log('Erro ao compartilhar:', err);
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copiado!', 'O link foi copiado para sua área de transferência.', 'success');
        });
    }
}

function likeArtwork() {
    if (!state.currentImage) return;
    
    state.likes++;
    updateStats();
    showToast('❤️ Obrigado!', 'Você curtiu esta obra de arte!', 'success');
}

function showLoading(show) {
    state.isGenerating = show;
    elements.loadingOverlay.classList.toggle('hidden', !show);
    elements.generateBtn.disabled = show;
    
    const btnText = elements.generateBtn.querySelector('.btn-text');
    if (show) {
        btnText.textContent = 'Criando...';
    } else {
        btnText.textContent = 'Gerar Arte';
    }
}

function updateStats() {
    elements.statsContainer.classList.remove('hidden');
    document.getElementById('viewCount').textContent = state.views;
    document.getElementById('likeCountStat').textContent = state.likes;
    document.getElementById('likeCount').textContent = `Curtir (${state.likes})`;
}

function addToHistory() {
    const dataUrl = elements.canvas.toDataURL();
    state.artworkHistory.unshift(dataUrl);
    
    // Keep only last 6 items
    if (state.artworkHistory.length > 6) {
        state.artworkHistory = state.artworkHistory.slice(0, 6);
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (state.artworkHistory.length === 0) return;
    
    elements.historyCard.style.display = 'block';
    elements.historyGrid.innerHTML = '';
    
    state.artworkHistory.forEach((artwork, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `<img src="${artwork}" alt="Artwork ${index + 1}">`;
        
        item.addEventListener('click', () => {
            const img = new Image();
            img.onload = () => {
                elements.ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
                elements.ctx.drawImage(img, 0, 0);
            };
            img.src = artwork;
        });
        
        elements.historyGrid.appendChild(item);
    });
}

function getCurrentEffectName() {
    const effect = CONFIG.artisticEffects.find(e => e.id === state.settings.effect);
    return effect ? effect.name : 'Desconhecido';
}

function showToast(title, description, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function savePreferences() {
    const prefs = {
        settings: state.settings,
        likes: state.likes,
        views: state.views
    };
    
    localStorage.setItem('artGeneratorPrefs', JSON.stringify(prefs));
}

function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('artGeneratorPrefs')) || {};
    
    if (prefs.settings) {
        state.settings = { ...state.settings, ...prefs.settings };
        
        // Update sliders
        Object.keys(elements.sliders).forEach(key => {
            if (state.settings[key] !== undefined) {
                elements.sliders[key].value = state.settings[key];
                document.getElementById(`${key}Value`).textContent = state.settings[key];
            }
        });
        
        // Update active effect
        document.querySelectorAll('.effect-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-effect="${state.settings.effect}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    if (prefs.likes) state.likes = prefs.likes;
    if (prefs.views) state.views = prefs.views;
}
