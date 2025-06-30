// Configurações
const UNSPLASH_ACCESS_KEY = 'AFHvJmJON5UsXS5uhW1x9y2omkl4dIUhJJYTc38j5gc';
const RANDOM_THEMES = [
    'medieval castle',
    'enchanted forest',
    'futuristic city',
    'ocean waves',
    'mountain landscape',
    'desert sunset',
    'space galaxy',
    'abstract art'
];

// Elementos DOM
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const searchInput = document.getElementById('searchInput');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const randomBtn = document.getElementById('randomBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

// Inicialização
setupCanvas();
setupEventListeners();

function setupCanvas() {
    const size = Math.min(window.innerWidth - 40, 600);
    canvas.width = size;
    canvas.height = size;
    drawPlaceholder();
}

function drawPlaceholder() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#999';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Digite um tema e clique em "Gerar Arte"', canvas.width/2, canvas.height/2);
}

function setupEventListeners() {
    generateBtn.addEventListener('click', handleGenerate);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleGenerate();
    });
    saveBtn.addEventListener('click', saveImage);
    randomBtn.addEventListener('click', generateRandomTheme);
    window.addEventListener('resize', setupCanvas);
}
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (searchInput.value.trim().length > 2) {
            handleGenerate();
        }
    }, 1000);
});
async function handleGenerate() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    try {
        showLoading(true);
        const imageUrl = await fetchUnsplashImage(query);
        await applyArtisticEffects(imageUrl);
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao gerar arte. Tente outro termo.");
    } finally {
        showLoading(false);
    }
}

async function fetchUnsplashImage(query) {
    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
        throw new Error('Falha na busca de imagens');
    }
    
    const data = await response.json();
    
    if (data.results.length === 0) {
        throw new Error('Nenhuma imagem encontrada para este termo');
    }
    
    return data.results[0].urls.regular;
}

async function applyArtisticEffects(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
            // Redimensiona mantendo proporção
            const ratio = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
            );
            const newWidth = img.width * ratio;
            const newHeight = img.height * ratio;
            
            // Limpa e desenha a imagem
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                (canvas.width - newWidth) / 2,
                (canvas.height - newHeight) / 2,
                newWidth,
                newHeight
            );
            
            // Aplica efeitos generativos
            applyGenerativeOverlay();
            resolve();
        };
        
        img.src = imageUrl;
    });
}

function applyGenerativeOverlay() {
    // Efeito de pinceladas
    ctx.globalCompositeOperation = 'overlay';
    
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 30 + 10;
        const hue = Math.random() * 360;
        
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.1)`;
        ctx.beginPath();
        
        if (Math.random() > 0.5) {
            ctx.arc(x, y, size, 0, Math.PI * 2);
        } else {
            ctx.rect(x - size/2, y - size/2, size, size);
        }
        
        ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'source-over';
}

function generateRandomTheme() {
    const randomTheme = RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)];
    searchInput.value = randomTheme;
    handleGenerate();
}

function saveImage() {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = searchInput.value 
        ? `arte-${searchInput.value.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`
        : `arte-generativa-${timestamp}`;
    
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function showLoading(show) {
    loadingIndicator.style.display = show ? 'flex' : 'none';
}

// Gera um tema aleatório ao carregar
generateRandomTheme();