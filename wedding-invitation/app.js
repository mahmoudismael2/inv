/**
 * Mahmoud & Bride's Wedding Invitation App
 * Interactive Logic: Countdown, Canvas Sparkles, Custom Bride Name, RSVP System & Audio Synth
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let state = {
    brideName: localStorage.getItem('wedding_bride_name') || 'Bride',
    musicPlaying: false,
    rsvps: JSON.parse(localStorage.getItem('wedding_rsvps')) || getInitialWishes()
  };

  // Target Date: August 19, 2026 18:00:00
  const TARGET_DATE = new Date('2026-08-19T18:00:00').getTime();

  // Initialize Features
  initBrideNameSystem();
  initCountdownTimer();
  initSparklesCanvas();
  initAudioSynth();
  initRSVPSystem();
  initCalendarActions();
  initNavigation();

  /* ==========================================================================
     1. Bride Name Personalizer System
     ========================================================================== */
  function initBrideNameSystem() {
    const editBtn = document.getElementById('editBrideBtn');
    const modal = document.getElementById('brideNameModal');
    const closeBtn = document.getElementById('closeBrideModal');
    const saveBtn = document.getElementById('saveBrideNameBtn');
    const input = document.getElementById('brideNameInput');

    applyBrideName(state.brideName);

    editBtn.addEventListener('click', () => {
      input.value = state.brideName;
      modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    saveBtn.addEventListener('click', () => {
      const newName = input.value.trim();
      if (newName) {
        state.brideName = newName;
        localStorage.setItem('wedding_bride_name', newName);
        applyBrideName(newName);
        modal.classList.remove('active');
      }
    });
  }

  function applyBrideName(name) {
    document.title = `Mahmoud & ${name}'s Wedding Invitation | August 19, 2026`;
    
    // Update all elements with class .bride-display-name
    document.querySelectorAll('.bride-display-name').forEach(el => {
      el.textContent = name;
    });

    // Update specific IDs
    const navBride = document.getElementById('navBrideName');
    const heroBride = document.getElementById('heroBrideName');

    if (navBride) navBride.textContent = name;
    if (heroBride) heroBride.textContent = name;
  }

  /* ==========================================================================
     2. Live Countdown Timer
     ========================================================================== */
  function initCountdownTimer() {
    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');

    function updateTimer() {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ==========================================================================
     3. Floating Sparkles & Gold Petals Canvas
     ========================================================================== */
  function initSparklesCanvas() {
    const canvas = document.getElementById('sparklesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 65;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        color: Math.random() > 0.3 ? '#e6c387' : '#ffffff',
        alpha: Math.random() * 0.7 + 0.2,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: Math.random() * 0.8 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Draw soft glowing diamond/star shape for wedding sparkle
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================================================
     4. Ambient Romantic Music Synthesizer (Web Audio API)
     ========================================================================== */
  function initAudioSynth() {
    const musicBtn = document.getElementById('musicToggleBtn');
    let audioCtx = null;
    let isPlaying = false;
    let timerId = null;

    // Sweet romantic melody notes (frequencies in Hz)
    const melodyNotes = [
      261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
      293.66, 349.23, 440.00, 587.33, // D4, F4, A4, D5
      329.63, 392.00, 493.88, 659.25, // E4, G4, B4, E5
      349.23, 440.00, 523.25, 698.46  // F4, A4, C5, F5
    ];

    function playRomanticArpeggio() {
      if (!isPlaying || !audioCtx) return;

      const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.6);

      timerId = setTimeout(playRomanticArpeggio, 800 + Math.random() * 400);
    }

    musicBtn.addEventListener('click', () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isPlaying = !isPlaying;

      if (isPlaying) {
        musicBtn.classList.add('active');
        musicBtn.style.color = '#f4d068';
        playRomanticArpeggio();
      } else {
        musicBtn.classList.remove('active');
        musicBtn.style.color = 'var(--gold-primary)';
        if (timerId) clearTimeout(timerId);
      }
    });
  }

  /* ==========================================================================
     5. RSVP System & Wishes Wall Manager
     ========================================================================== */
  function initRSVPSystem() {
    const rsvpForm = document.getElementById('rsvpForm');
    const successMsg = document.getElementById('rsvpSuccessMsg');
    const successDetail = document.getElementById('rsvpSuccessDetail');
    const resetBtn = document.getElementById('rsvpResetBtn');
    const wishesGrid = document.getElementById('wishesGrid');

    renderWishes();

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guestName').value.trim();
      const email = document.getElementById('guestEmail').value.trim();
      const attendance = document.getElementById('attendance').value;
      const guestCount = document.getElementById('guestCount').value;
      const message = document.getElementById('wishesMessage').value.trim();

      const newRsvp = {
        id: Date.now(),
        name,
        email,
        attendance,
        guestCount,
        message: message || "Wishing Mahmoud & " + state.brideName + " a lifetime of love, joy, and happiness!",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      state.rsvps.unshift(newRsvp);
      localStorage.setItem('wedding_rsvps', JSON.stringify(state.rsvps));

      // Show success screen
      rsvpForm.classList.add('hidden');
      successMsg.classList.remove('hidden');
      successDetail.textContent = `Thank you, ${name}! Your RSVP (${attendance}) for ${guestCount} guest(s) is confirmed for August 19, 2026 at Hilton.`;

      renderWishes();
    });

    resetBtn.addEventListener('click', () => {
      rsvpForm.reset();
      successMsg.classList.add('hidden');
      rsvpForm.classList.remove('hidden');
    });
  }

  function renderWishes() {
    const wishesGrid = document.getElementById('wishesGrid');
    if (!wishesGrid) return;

    wishesGrid.innerHTML = '';

    state.rsvps.forEach(rsvp => {
      const card = document.createElement('div');
      card.className = 'wish-card glass-card';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(rsvp.name)}</span>
          <span class="wish-status-badge"><i class="fa-solid fa-heart"></i> ${escapeHtml(rsvp.attendance)}</span>
        </div>
        <p class="wish-body">"${escapeHtml(rsvp.message)}"</p>
        <div class="wish-footer">
          <i class="fa-regular fa-clock"></i> ${escapeHtml(rsvp.date)}
        </div>
      `;
      wishesGrid.appendChild(card);
    });
  }

  function getInitialWishes() {
    return [
      {
        id: 1,
        name: "Tariq & Family",
        attendance: "Joyfully Accept",
        guestCount: "2",
        message: "Congratulations Mahmoud! Wishing you both an incredible journey filled with eternal joy and blessings.",
        date: "Aug 8, 2026"
      },
      {
        id: 2,
        name: "Karim (Best Man)",
        attendance: "Joyfully Accept",
        guestCount: "1",
        message: "So proud of you Mahmoud! Can't wait to celebrate at the Hilton for the party of the century!",
        date: "Aug 7, 2026"
      },
      {
        id: 3,
        name: "Nour & Layla",
        attendance: "Joyfully Accept",
        guestCount: "2",
        message: "May your marriage be blessed with warmth, laughter, and endless love!",
        date: "Aug 6, 2026"
      }
    ];
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  /* ==========================================================================
     6. Calendar Actions (.ics file generation & Google Cal link)
     ========================================================================== */
  function initCalendarActions() {
    const icsBtn = document.getElementById('downloadIcsBtn');
    const googleBtn = document.getElementById('googleCalBtn');

    const eventTitle = `Mahmoud & ${state.brideName} Wedding Celebration`;
    const location = "Hilton Hotel - Grand Ballroom";
    const details = "Join us to celebrate the wedding of Mahmoud and his Bride at the Hilton Hotel!";
    const startDate = "20260819T180000Z";
    const endDate = "20260819T235900Z";

    // Build Google Calendar URL
    if (googleBtn) {
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
      googleBtn.href = googleUrl;
    }

    // Build .ics File Download
    if (icsBtn) {
      icsBtn.addEventListener('click', () => {
        const icsData = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Mahmoud Wedding Invitation//EN",
          "BEGIN:VEVENT",
          `SUMMARY:${eventTitle}`,
          `LOCATION:${location}`,
          `DESCRIPTION:${details}`,
          `DTSTART:${startDate}`,
          `DTEND:${endDate}`,
          "STATUS:CONFIRMED",
          "END:VEVENT",
          "END:VCALENDAR"
        ].join("\n");

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Mahmoud_Wedding_August19_2026.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  /* ==========================================================================
     7. Navbar Scroll & Mobile Navigation
     ========================================================================== */
  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    mobileBtn.addEventListener('click', () => {
      drawer.classList.add('open');
    });

    closeDrawerBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    });
  }
});
