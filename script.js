/* ============================================================
   MOMMY'S CORNER — Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- SECRET CONFIG ---------- */
  const SECRET_CODE = '2055';     // Case-insensitive
  const VISITS_REQUIRED = 5;                 // Visits before the Secret Door appears
  const VISIT_KEY = 'mommysVisits';
  const UNLOCK_KEY = 'mommysUnlocked';

  /* ---------- DAILY MESSAGE ---------- */
  const dailyMessages = [
    "Sweeties check in daily.",
    "Mommy notices when you're gone.",
    "Patience is a virtue, sweetie.",
    "You're doing so well today.",
    "Don't keep me waiting too long.",
    "I'm proud of you for showing up.",
    "Such a good sweetie for coming back.",
  ];
  const dailyText = document.getElementById('daily-text');
  if (dailyText) {
    dailyText.textContent = dailyMessages[new Date().getDate() % dailyMessages.length];
  }

  /* ---------- MOOD INDICATOR ---------- */
  const moodDot = document.getElementById('mood-dot');
  const moodLabel = document.getElementById('mood-label');
  if (moodDot && moodLabel) {
    const hour = new Date().getHours();
    let color, label;
    if (hour >= 5 && hour < 12) {
      color = '#ffd700'; label = 'Mommy is... just waking up';
    } else if (hour >= 12 && hour < 17) {
      color = '#ffb6c1'; label = 'Mommy is... feeling playful';
    } else if (hour >= 17 && hour < 21) {
      color = '#d8bfd8'; label = 'Mommy is... winding down';
    } else {
      color = '#8a2be2'; label = 'Mommy is... thinking of you';
    }
    moodDot.style.background = color;
    moodDot.style.boxShadow = `0 0 10px ${color}`;
    moodLabel.textContent = label;
  }

  /* ---------- HAMBURGER MENU ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const menuIcon = document.getElementById('menu-icon');
  const navOverlay = document.getElementById('quick-links');

  const ICON_MENU = '<path d="M4 7h16M4 12h16M4 17h16"/>';
  const ICON_X    = '<path d="M6 6l12 12M18 6 6 18"/>';

  const setMenuIcon = (open) => {
    if (menuIcon) menuIcon.innerHTML = open ? ICON_X : ICON_MENU;
  };

  const openMenu = () => {
    navOverlay.classList.add('is-open');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    setMenuIcon(true);
  };

  const closeMenu = () => {
    navOverlay.classList.remove('is-open');
    navOverlay.classList.remove('is-contact');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    setMenuIcon(false);
  };

  menuToggle.addEventListener('click', () => {
    if (navOverlay.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  /* Close button inside the menu overlay */
  const menuClose = document.getElementById('menu-close');
  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  /* ---------- CONTACT PANEL ---------- */
  const contactLink = document.getElementById('contact-link');
  const contactBack = document.getElementById('contact-back');
  contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    navOverlay.classList.add('is-contact');
  });
  contactBack.addEventListener('click', () => {
    navOverlay.classList.remove('is-contact');
  });

  /* ---------- OBEDIENCE METER ---------- */
  const meterFill = document.getElementById('meter-fill');
  const meterText = document.getElementById('meter-text');
  let obedienceLevel = 0;
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      if (obedienceLevel < 100) {
        obedienceLevel = Math.min(obedienceLevel + 20, 100);
        meterFill.style.width = obedienceLevel + '%';
        meterText.textContent = obedienceLevel + '%';
      }
    });
  });

  /* ---------- VISIT COUNTER (Secret Door unlock) ---------- */
  let visits = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1;
  localStorage.setItem(VISIT_KEY, visits);
  const alreadyUnlocked = localStorage.getItem(UNLOCK_KEY) === 'true';

  /* ---------- SECRET DOOR ELEMENTS ---------- */
  const secretLink = document.getElementById('secret-link');
  const secretOverlay = document.getElementById('secret-overlay');
  const gateStage = document.getElementById('gate-stage');
  const codeStage = document.getElementById('code-stage');
  const revealStage = document.getElementById('reveal-stage');
  const codeForm = document.getElementById('code-form');
  const codeInput = document.getElementById('code-input');
  const codeError = document.getElementById('code-error');
  const codeBtn = document.getElementById('code-btn');
  const codeBack = document.getElementById('code-back');
  const typingEl = document.getElementById('secret-typing');
  const lockEl = document.getElementById('secret-lock');
  const successEl = document.getElementById('secret-success');
  const rewardBtn = document.getElementById('secret-reward-button');
  const secretContent = document.getElementById('secret-content');
  const secretClose = document.getElementById('secret-close');

  const SECRET_MESSAGE = "So... you came back. And you supported me. That's not a coincidence. You're one of my favorites now...";

  let timers = [];
  const clearTimers = () => { timers.forEach((t) => clearTimeout(t) || clearInterval(t)); timers = []; };

   const showStage = (stage, withFade = false) => {
    const allStages = [gateStage, codeStage, revealStage];
    if (!withFade) {
      allStages.forEach((s) => { s.hidden = s !== stage; s.classList.remove('is-fading'); });
      return;
    }
    // Fade out the currently visible one, then swap
    const visible = allStages.find((s) => !s.hidden);
    if (visible) {
      visible.classList.add('is-fading');
      setTimeout(() => {
        allStages.forEach((s) => {
          s.hidden = s !== stage;
          s.classList.remove('is-fading');
        });
      }, 450);
    } else {
      allStages.forEach((s) => { s.hidden = s !== stage; s.classList.remove('is-fading'); });
    }
  };

  const resetSecret = () => {
    clearTimers();
    typingEl.innerHTML = '';
    lockEl.classList.remove('is-visible', 'is-shaking', 'is-unlocked');
    lockEl.innerHTML = `<svg viewBox="0 0 24 24" width="58" height="58" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
    successEl.hidden = true;
    rewardBtn.hidden = true;
    rewardBtn.classList.remove('is-visible');
    secretContent.hidden = true;
    secretClose.hidden = true;
    codeError.hidden = true;
    codeInput.value = '';
  };

  const openSecret = () => {
    closeMenu();
    resetSecret();
    secretOverlay.classList.add('is-open');
    secretOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('secret-open');
    // If already unlocked, skip the gate
    if (alreadyUnlocked) {
      startReveal();
    } else {
      showStage(gateStage);
    }
  };

  const closeSecret = () => {
    secretOverlay.classList.remove('is-open');
    secretOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('secret-open');
    clearTimers();
  };

  const startReveal = () => {
        showStage(revealStage, true);
    // Type message
    let i = 0;
    const typingInterval = setInterval(() => {
      i++;
      typingEl.innerHTML = SECRET_MESSAGE.slice(0, i) + '<span class="secret-cursor"></span>';
      if (i >= SECRET_MESSAGE.length) {
        clearInterval(typingInterval);
        typingEl.innerHTML = SECRET_MESSAGE;   // strip cursor
        // Pause, shake
        const t1 = setTimeout(() => {
          lockEl.classList.add('is-visible', 'is-shaking');
          // Unlock after shake
          const t2 = setTimeout(() => {
            lockEl.classList.remove('is-shaking');
            lockEl.classList.add('is-unlocked');
            lockEl.innerHTML = `<svg viewBox="0 0 24 24" width="58" height="58" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>`;
            successEl.hidden = false;
            // Show reward button
            const t3 = setTimeout(() => {
              rewardBtn.hidden = false;
              rewardBtn.classList.add('is-visible');
              secretClose.hidden = false;
            }, 1000);
            timers.push(t3);
          }, 1000);
          timers.push(t2);
        }, 1500);
        timers.push(t1);
      }
    }, 50);
    timers.push(typingInterval);
  };

  secretLink.addEventListener('click', (e) => {
    e.preventDefault();
    openSecret();
  });

  /* ---------- Gate: enter code flow ---------- */
  codeBtn.addEventListener('click', () => {
    showStage(codeStage);
    setTimeout(() => codeInput.focus(), 200);
  });
  codeBack.addEventListener('click', () => {
    codeError.hidden = true;
    codeInput.value = '';
    showStage(gateStage);
  });

  codeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const typed = (codeInput.value || '').trim().toLowerCase();
    if (typed === SECRET_CODE.toLowerCase()) {
      // Success — remember it
      localStorage.setItem(UNLOCK_KEY, 'true');
      startReveal();
    } else {
      codeError.hidden = false;
      codeInput.classList.add('shake');
      setTimeout(() => codeInput.classList.remove('shake'), 500);
      codeInput.value = '';
      codeInput.focus();
    }
  });

  /* ---------- Reward reveal ---------- */
    rewardBtn.addEventListener('click', () => {
    rewardBtn.classList.add('is-fading');
    setTimeout(() => {
      rewardBtn.hidden = true;
      rewardBtn.classList.remove('is-visible', 'is-fading');
      secretContent.hidden = false;
      secretContent.classList.add('is-appearing');
    }, 450);
  });

  secretClose.addEventListener('click', closeSecret);

  /* ---------- ESC closes everything ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeSecret();
    }
  });

   /* ---------- Secret Door visit hint ---------- */
  const secretHint = document.getElementById('secret-hint');
  if (secretHint) {
    if (alreadyUnlocked) {
      secretHint.textContent = '🔓 Unlocked';
      secretHint.classList.add('is-unlocked');
    } else if (visits >= VISITS_REQUIRED) {
      secretHint.textContent = `🔓 ${visits}/5 — ready`;
      secretHint.classList.add('is-unlocked');
    } else {
      secretHint.textContent = `🔒 ${visits}/5 visits`;
    }
  }

});
