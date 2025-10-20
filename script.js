document.addEventListener('DOMContentLoaded', () => {
     const enterBtn = document.getElementById('enter-btn');
    const welcomeModal = document.getElementById('welcome-modal');
    const mainContent = document.getElementById('main-content');
    
    enterBtn.addEventListener('click', () => {
        welcomeModal.classList.add('opacity-0');
        setTimeout(() => welcomeModal.style.display = 'none', 1000);
        mainContent.classList.remove('opacity-0');
    });

    // --- Navigation Logic ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.w-full.max-w-lg > section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.dataset.section;
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            sections.forEach(section => {
                section.classList.toggle('hidden', section.id !== targetSectionId);
            });
        });
    });

    // --- Interactive Diya Logic ---
    const interactiveDiyas = document.querySelectorAll('.interactive-diya');
    interactiveDiyas.forEach(diya => {
        diya.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents click from triggering firework
            const flame = diya.querySelector('.flame');
            flame.classList.toggle('unlit');
            flame.classList.toggle('lit');
        });
    });

    // --- Wish Generation Logic ---
    const generateBtn = document.getElementById('generateBtn');
    const senderNameInput = document.getElementById('senderName');
    const recipientNameInput = document.getElementById('recipientName');
    const wishContainer = document.getElementById('wishContainer');
    const wishOutput = document.getElementById('wishOutput');
    const copyBtn = document.getElementById('copyBtn');

    const wishes = [
        "May the divine light of Diwali spread into your life, bringing peace, prosperity, happiness, and good health. Wishing you a sparkling celebration, {recipient}!",
        "On this auspicious festival of lights, may the glow of joy, prosperity, and happiness illuminate your days in the year ahead. Happy Diwali, {recipient}!",
        "May the beauty of Deepawali fill your home with happiness, and may the coming year provide you with everything that brings you joy. Warm wishes from {sender} to you, {recipient}.",
        "Let each diya you light bring a glow of happiness on your face and enlighten your soul. Wishing a very Happy Diwali to you and your family, {recipient}. From, {sender}.",
        "With the shining of diyas and the echoes of the chants, may happiness and contentment fill your life. Sending heartfelt Diwali wishes to you, {recipient}."
    ];

     generateBtn.addEventListener('click', () => {
        const sender = senderNameInput.value.trim() || 'A well-wisher';
        const recipient = recipientNameInput.value.trim() || 'Dear Friend';
        const randomWishTemplate = wishes[Math.floor(Math.random() * wishes.length)];
        const finalWish = randomWishTemplate
            .replace('{recipient}', `<strong>${recipient}</strong>`)
            .replace('{sender}', `<strong>${sender}</strong>`);
        wishOutput.innerHTML = `<p>${finalWish}</p><br><p>With love and light,<br><strong>${sender}</strong></p>`;
        wishContainer.classList.remove('hidden');
    });

    // --- Copy to Clipboard Logic ---
    const copyToast = document.getElementById('copy-toast');
    copyBtn.addEventListener('click', () => {
        const textToCopy = wishOutput.innerText;
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            copyToast.classList.remove('opacity-0');
            setTimeout(() => copyToast.classList.add('opacity-0'), 2000);
        } catch (err) { console.error('Failed to copy text: ', err); }
        document.body.removeChild(textArea);
    });
});

// --- Interactive Effects Canvas (Fireworks + Sparkler Cursor) ---
const canvas = document.getElementById('effects-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: null, y: null };

class Particle {
    constructor(x, y, hue, isFireworkExplosion) {
        this.x = x;
        this.y = y;
        this.isFireworkExplosion = isFireworkExplosion;

        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * (isFireworkExplosion ? 6 : 4) + 1;
        this.friction = 0.98;
        this.gravity = isFireworkExplosion ? 0.1 : 0;
        
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = Math.sin(this.angle) * this.speed;
        
        this.life = Math.random() * 30 + 60;
        this.initialLife = this.life;
        
        this.hue = hue;
        this.brightness = Math.random() * 30 + 50;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        this.life -= 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        const opacity = this.life / this.initialLife;
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${opacity > 0 ? opacity : 0})`;
        ctx.fill();
    }
}

function createExplosion(x, y) {
     const hue = Math.random() * 360;
     for (let i = 0; i < 70; i++) {
        particles.push(new Particle(x, y, hue, true));
    }
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Create fewer cursor particles for a cleaner look
    if (Math.random() > 0.5) {
        particles.push(new Particle(mouse.x, mouse.y, 45, false));
    }
});

window.addEventListener('click', (e) => {
    createExplosion(e.clientX, e.clientY);
});

function animate() {
    ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Reduced automatic firework frequency
    if (Math.random() < 0.01) {
         const x = Math.random() * canvas.width;
         const y = Math.random() * (canvas.height / 2);
         createExplosion(x,y);
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();
