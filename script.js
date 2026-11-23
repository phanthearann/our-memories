// 1. Auto-play Music on Enter + Smooth Fade-In Volume
const enterBtn = document.getElementById('enterBtn');
const welcomeOverlay = document.getElementById('welcomeOverlay');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');

let isPlaying = false;
let fadeInterval = null;

function fadeInMusic(targetVolume = 0.45, duration = 1500) {
  clearInterval(fadeInterval);
  bgMusic.volume = 0;

  bgMusic.play().then(() => {
    isPlaying = true;
    updateMusicUI();

    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = targetVolume / steps;

    fadeInterval = setInterval(() => {
      if (bgMusic.volume + volumeStep < targetVolume) {
        bgMusic.volume = Math.min(targetVolume, bgMusic.volume + volumeStep);
      } else {
        bgMusic.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }).catch(() => {
    isPlaying = false;
    updateMusicUI();
  });
}

// ចុចប៊ូតុងបើកទំព័រ -> បិទផ្ទាំងស្វាគមន៍ ហើយចាក់ភ្លេងស្វ័យប្រវត្តិ
enterBtn.addEventListener('click', () => {
  welcomeOverlay.classList.add('hidden');
  fadeInMusic(0.45, 1500);
});

// ប៊ូតុងបិទ/បើកភ្លេងនៅជ្រុងខាងលើ
musicToggle.addEventListener('click', () => {
  if (isPlaying) {
    clearInterval(fadeInterval);
    bgMusic.pause();
    isPlaying = false;
    updateMusicUI();
  } else {
    fadeInMusic(0.45, 800);
  }
});

function updateMusicUI() {
  musicIcon.textContent = isPlaying ? '🎵' : '🔇';
  musicText.textContent = isPlaying ? 'កំពុងចាក់ភ្លេង' : 'បិទសំឡេង';
}

// 2. Scroll Reveal Animation for Polaroid Cards
const polaroids = document.querySelectorAll('.polaroid');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (index % 4) * 100);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

polaroids.forEach((card) => observer.observe(card));

// 3. Lightbox Modal (បើចុចមើលរូបភាព ហើយភ្លេងមិនទាន់ដើរ វានឹងចាក់ស្វ័យប្រវត្តិដែរ)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');

polaroids.forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    lightboxImg.src = img.src;
    lightboxCaption.textContent = card.dataset.caption || '';
    lightbox.classList.add('active');

    if (!isPlaying) {
      fadeInMusic(0.45, 1000);
    }
  });
});

closeLightbox.addEventListener('click', () => lightbox.classList.remove('active'));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});