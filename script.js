/* ============================================================
   MOMMY'S CORNER — Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- SECRET CONFIG ---------- */
  const SECRET_CODE = '2055';                // Case-insensitive
  const VISITS_REQUIRED = 5;
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
  const menuClose = document.getElementById('menu-close');
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
    setMenuIcon(true);
  };

  const closeMenu = () => {
    navOverlay.classList.remove('is-open');
    navOverlay.classList.remove('is-contact');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    setMenuIcon(false);
  };

  menuToggle.addEventListener('click', () => {
    if (navOverlay.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  if (menuClose) menuClose.addEventListener('click', closeMenu);

  /* ---------- CONTACT PANEL ---------- */
  const contactLink = document.getElementById('contact-link');
  const contactBack = document.getElementById('contact-back');
  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      navOverlay.classList.add('is-contact');
    });
  }
  if (contactBack) {
    contactBack.addEventListener('click', () => {
      navOverlay.classList.remove('is-contact');
    });
  }

  /* ---------- OBEDIENCE METER ---------- */
  const meterFill = document.getElementById('meter-fill');
  const meterText = document.getElementById('meter-text');
  let obedienceLevel = 0;
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      if (obedienceLevel < 100) {
        obedienceLevel = Math.min(obedienceLevel + 20, 100);
        if (meterFill) meterFill.style.width = obedienceLevel + '%';
        if (meterText) meterText.textContent = obedienceLevel + '%';
      }
    });
  });

  /* ---------- VISIT COUNTER ---------- */
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
  const LOCK_SVG_LOCKED = `<svg viewBox="0 0 24 24" width="58" height="58" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
  const LOCK_SVG_OPEN   = `<svg viewBox="0 0 24 24" width="58" height="58" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>`;

  let timers = [];
  const clearTimers = () => {
    timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
    timers = [];
  };

  /* ---------- STAGE MANAGER ---------- */
  const allStages = [gateStage, codeStage, revealStage];

  const hideAllStages = () => {
    allStages.forEach((s) => {
      s.classList.add('is-hidden');
      s.classList.remove('is-visible', 'is-fading-in', 'is-fading-out');
    });
  };

  const setStage = (stage) => {
    allStages.forEach((s) => {
      if (s === stage) {
        s.classList.remove('is-hidden', 'is-fading-out');
        s.classList.add('is-fading-in');
        // force reflow, then animate in
        void s.offsetWidth;
        s.classList.remove('is-fading-in');
        s.classList.add('is-visible');
      } else {
        s.classList.add('is-hidden');
        s.classList.remove('is-visible', 'is-fading-in', 'is-fading-out');
      }
    });
  };

  const fadeOutStage = (stage, onDone) => {
    stage.classList.remove('is-visible');
    stage.classList.add('is-fading-out');
    setTimeout(() => {
      stage.classList.add('is-hidden');
      stage.classList.remove('is-fading-out');
      if (onDone) onDone();
    }, 450);
  };

  /* ---------- RESET ---------- */
  const resetSecret = () => {
    clearTimers();
    hideAllStages();

    // Reset typing
    typingEl.innerHTML = '';
    typingEl.style.opacity = '1';

    // Reset lock
    lockEl.classList.remove('is-visible', 'is-shaking', 'is-unlocked');
    lockEl.innerHTML = LOCK_SVG_LOCKED;

    // Hide success, reward button, content
    successEl.hidden = true;
    successEl.style.opacity = '';
    rewardBtn.hidden = true;
    rewardBtn.classList.remove('is-visible');
    secretContent.hidden = true;
    secretContent.style.opacity = '';

    secretClose.hidden = true;
    codeError.hidden = true;
    codeInput.value = '';
  };

  /* ---------- OPEN / CLOSE ---------- */
  const openSecret = () => {
    closeMenu();
    resetSecret();
    secretOverlay.classList.add('is-open');
    secretOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('secret-open');
    if (alreadyUnlocked) {
      startReveal();
    } else {
      setStage(gateStage);
    }
  };

  const closeSecret = () => {
    secretOverlay.classList.remove('is-open');
    secretOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('secret-open');
    clearTimers();
  };

  /* ---------- REVEAL SEQUENCE ---------- */
  const startReveal = () => {
    setStage(revealStage);

    // 1. Typing
    let i = 0;
    typingEl.style.opacity = '1';
    typingEl.innerHTML = '';
    const typingInterval = setInterval(() => {
      i++;
      typingEl.innerHTML = SECRET_MESSAGE.slice(0, i) + '<span class="secret-cursor"></span>';
      if (i >= SECRET_MESSAGE.length) {
        clearInterval(typingInterval);
        typingEl.innerHTML = SECRET_MESSAGE;

        // 2. Pause, then fade typing out
        const t1 = setTimeout(() => {
          typingEl.style.opacity = '0';

          // 3. After typing fully gone, show lock
          const t2 = setTimeout(() => {
            lockEl.classList.add('is-visible');

            // 4. Shake
            const t3 = setTimeout(() => {
              lockEl.classList.add('is-shaking');

              // 5. Unlock
              const t4 = setTimeout(() => {
                lockEl.classList.remove('is-shaking');
                lockEl.classList.add('is-unlocked');
                lockEl.innerHTML = LOCK_SVG_OPEN;
                successEl.hidden = false;

                // 6. After a pause, fade out lock + success
                const t5 = setTimeout(() => {
                  lockEl.classList.remove('is-visible');
                  successEl.style.transition = 'opacity .45s ease';
                  successEl.style.opacity = '0';

                  // 7. Show reward button
                  const t6 = setTimeout(() => {
                    successEl.hidden = true;
                    successEl.style.opacity = '';
                    rewardBtn.hidden = false;
                    rewardBtn.classList.add('is-visible');
                    secretClose.hidden = false;
                  }, 450);
                  timers.push(t6);
                }, 1400);
                timers.push(t5);
              }, 1000);
              timers.push(t4);
            }, 300);
            timers.push(t3);
          }, 450);
          timers.push(t2);
        }, 1500);
        timers.push(t1);
      }
    }, 50);
    timers.push(typingInterval);
  };

  /* ---------- LINK CLICK ---------- */
  if (secretLink) {
    secretLink.addEventListener('click', (e) => {
      e.preventDefault();
      openSecret();
    });
  }

  /* ---------- GATE FLOW ---------- */
  if (codeBtn) {
    codeBtn.addEventListener('click', () => {
      fadeOutStage(gateStage, () => {
        setStage(codeStage);
        setTimeout(() => codeInput.focus(), 200);
      });
    });
  }

  if (codeBack) {
    codeBack.addEventListener('click', () => {
      codeError.hidden = true;
      codeInput.value = '';
      fadeOutStage(codeStage, () => setStage(gateStage));
    });
  }

  if (codeForm) {
    codeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const typed = (codeInput.value || '').trim().toLowerCase();
      if (typed === SECRET_CODE.toLowerCase()) {
        localStorage.setItem(UNLOCK_KEY, 'true');
        fadeOutStage(codeStage, () => {
          // reset everything visually before reveal
          successEl.hidden = true;
          rewardBtn.hidden = true;
          rewardBtn.classList.remove('is-visible');
          secretContent.hidden = true;
          lockEl.classList.remove('is-visible', 'is-shaking', 'is-unlocked');
          lockEl.innerHTML = LOCK_SVG_LOCKED;
          typingEl.style.opacity = '1';
          typingEl.innerHTML = '';
          startReveal();
        });
      } else {
        codeError.hidden = false;
        codeInput.classList.add('shake');
        setTimeout(() => codeInput.classList.remove('shake'), 500);
        codeInput.value = '';
        codeInput.focus();
      }
    });
  }

  /* ---------- REWARD REVEAL ---------- */
  if (rewardBtn) {
    rewardBtn.addEventListener('click', () => {
      rewardBtn.classList.remove('is-visible');
      setTimeout(() => {
        rewardBtn.hidden = true;
        secretContent.hidden = false;
        secretContent.style.opacity = '0';
        requestAnimationFrame(() => {
          secretContent.style.transition = 'opacity .45s ease';
          secretContent.style.opacity = '1';
        });
      }, 450);
    });
  }

  if (secretClose) secretClose.addEventListener('click', closeSecret);

  /* ---------- ESC ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeSecret();
    }
  });

  /* ---------- VISIT HINT ---------- */
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
