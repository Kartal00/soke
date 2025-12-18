// scripts.js
document.addEventListener('DOMContentLoaded', function () {
  const watchButtons = document.querySelectorAll('.watch-btn');
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeBtn = document.getElementById('closeModal');
  const backdrop = document.getElementById('modalBackdrop');

  function openModal(videoSrc) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    modalVideo.src = videoSrc;
    modalVideo.currentTime = 0;
    modalVideo.play().catch(()=>{ /* autoplay may be blocked */ });
    // focus management
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }

  watchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const video = btn.getAttribute('data-video');
      if (!video) return;
      openModal(video);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });

  // bottom year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sources toggle (initially hidden). User must scroll to bottom and press OK to open.
  const toggleBtn = document.getElementById('toggleSources');
  const sourcesEl = document.getElementById('sources');

  // Ensure initial state hidden
  if (sourcesEl) sourcesEl.hidden = true;

  toggleBtn.addEventListener('click', () => {
    const isHidden = sourcesEl.hidden;
    sourcesEl.hidden = !isHidden;
    toggleBtn.setAttribute('aria-expanded', String(!isHidden));
    // smooth scroll into view when opening
    if (!isHidden) {
      // it was hidden, now opened -> show
      sourcesEl.hidden = false;
      sourcesEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // it was visible, now hide
      sourcesEl.hidden = true;
      // leave focus on toggle
    }
  });

  // To help ensure user reaches bottom before enabling OK, we optionally prevent toggle unless at bottom.
  // According to request: "kaynakça site ilk açılınca kapalı olacak kullanıcı en alta gidip ok tuşuna basınca açılacak"
  // So disable OK until scrolled near bottom:
  function isNearBottom(threshold = 150) {
    return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold);
  }

  function updateToggleAvailability() {
    if (isNearBottom()) {
      toggleBtn.disabled = false;
      toggleBtn.classList.remove('disabled');
      toggleBtn.title = "OK (kaynakçayı açmak/kapatmak için tıklayın)";
    } else {
      toggleBtn.disabled = true;
      toggleBtn.classList.add('disabled');
      toggleBtn.title = "Sayfanın en altına gidince etkinleşir";
      // ensure hidden while not at bottom
      sourcesEl.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // init
  updateToggleAvailability();
  window.addEventListener('scroll', updateToggleAvailability);
  window.addEventListener('resize', updateToggleAvailability);

  // Download button: keep standard anchor with download attribute (works for many setups).
  const downloadBtn = document.getElementById('downloadBtn');
  // Small UX: confirm on non-mobile devices to avoid accidental download
  downloadBtn.addEventListener('click', (e) => {
    // nothing to block — anchor will attempt to download edeb/söke.apk
    // but for desktop browsers where apk may just open, allow default behavior.
  });

  // Minimal focus trap for modal (keyboard)
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (document.activeElement === closeBtn) modalVideo.focus();
      else closeBtn.focus();
    }
  });
});
// OK butonu
const toggleBtn = document.getElementById("toggleSources");

// Kaynakça kutusu
const sourcesEl = document.getElementById("sources");

// Başlangıçta gizli
sourcesEl.style.display = "none";

// OK tuşu her zaman aktif – tıklayınca aç/kapa yapacak
toggleBtn.addEventListener("click", () => {
    if (sourcesEl.style.display === "none") {
        sourcesEl.style.display = "block";
    } else {
        sourcesEl.style.display = "none";
    }
});