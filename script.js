/* 
 * PORTFOLIO SISWA MODERN - JAVASCRIPT CORE
 * Menangani logika preloader, dark mode, navigasi sticky, efek mengetik (typing),
 * animasi scroll, slider testimoni, lightbox galeri, dan validasi kontak form.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. PRELOADER (LOADING SCREEN)
     ========================================== */
  const preloader = document.getElementById('preloader');
  let preloaderHidden = false;

  const hidePreloader = () => {
    if (preloaderHidden) return;
    preloaderHidden = true;
    
    // Memberikan delay sedikit agar animasi spinner terlihat estetik
    setTimeout(() => {
      if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }
    }, 800);
  };
  
  // Sembunyikan preloader ketika seluruh halaman selesai dimuat
  window.addEventListener('load', hidePreloader);

  // Fallback jika DOM sudah interaktif / komplit saat script berjalan
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    hidePreloader();
  }

  // Pengaman Tambahan: Jika setelah 1.5 detik preloader masih tampil (misal karena gambar luar lambat dimuat), sembunyikan saja
  setTimeout(hidePreloader, 1500);


  /* ==========================================
     2. DARK MODE & LIGHT MODE TOGGLE
     ========================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Ambil preferensi tema dari localStorage atau gunakan sistem OS default (dark)
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Set tema awal
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  // Toggle tema saat tombol diklik
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Kirim toast pemberitahuan perubahan tema
    showToast(
      newTheme === 'dark' ? 'Mode Gelap Aktif' : 'Mode Terang Aktif',
      `Berhasil mengubah tampilan ke mode ${newTheme === 'dark' ? 'gelap' : 'terang'}.`,
      'success'
    );
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.setAttribute('title', 'Aktifkan Mode Terang');
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.setAttribute('title', 'Aktifkan Mode Gelap');
    }
  }


  /* ==========================================
     3. STICKY NAV BAR & SCROLL EFFECTS
     ========================================== */
  const header = document.querySelector('header');
  const backToTopBtn = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Tambahkan background solid ketika navbar di-scroll melebihi 50px
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Tampilkan / sembunyikan tombol Back to Top
    if (scrollPos > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Aksi tombol Back To Top
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* ==========================================
     4. RESPONSIVE MOBILE MENU (HAMBURGER)
     ========================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const menuToggleIcon = menuToggle.querySelector('i');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item a');

  // Buka / Tutup Menu Mobile
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    const isOpen = navMenu.classList.contains('active');
    menuToggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });

  // Tutup menu otomatis jika link navigasi diklik
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggleIcon.className = 'fa-solid fa-bars';
    });
  });


  /* ==========================================
     5. EFFECTS: TYPING ANIMATION (HERO)
     ========================================== */
  const typedTextSpan = document.getElementById('typed-text');
  const textArray = ["UI/UX Designer", "Front-End Developer", "Pelajar Kreatif", "Tech Enthusiast"];
  const typingSpeed = 100;
  const erasingSpeed = 60;
  const newTextDelay = 2000; // Delay jeda sebelum menghapus kalimat
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingSpeed + 500);
    }
  }

  // Mulai animasi mengetik
  if (typedTextSpan) {
    setTimeout(type, 1000);
  }


  /* ==========================================
     6. SCROLL ANIMATION & SKILL PROGRESS FILLING
     ========================================== */
  // Deteksi elemen-elemen yang perlu dianmasikan saat muncul di layar (AOS alternatif)
  const animElements = document.querySelectorAll('.timeline-item, .skills-column, .project-card, .gallery-item, .about-info-card, .about-desc-container');
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Jika target adalah kolom keahlian, triggers animasi pengisian progress bar
        if (entry.target.classList.contains('skills-column')) {
          const bars = entry.target.querySelectorAll('.progress-bar-fill');
          bars.forEach(bar => {
            const targetPercent = bar.getAttribute('data-width');
            bar.style.width = targetPercent;
          });
        }
        
        // Matikan observer setelah elemen selesai teranimasi (opsional, agar animasi terjadi sekali saja)
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15 // Elemen terpicu jika 15% bagian muncul di layar
  });

  animElements.forEach(el => {
    scrollObserver.observe(el);
  });


  /* ==========================================
     7. NAVIGATION LINKS SPY (ACTIVE STATE ON SCROLL)
     ========================================== */
  const sections = document.querySelectorAll('section');
  
  const navSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px' // Menghitung fokus di bagian tengah-atas halaman
  });

  sections.forEach(section => {
    navSpyObserver.observe(section);
  });


  /* ==========================================
     8. TESTIMONIAL CAROUSEL (SLIDER INTERAKTIF)
     ========================================== */
  const slider = document.getElementById('testimonial-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  
  let currentSlideIndex = 0;
  const slideCount = slides.length;
  let autoplayTimer;

  if (slider && slideCount > 0) {
    // Buat pagination dots berdasarkan jumlah slide
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', index);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function updateDots() {
      dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(index) {
      if (index < 0) {
        currentSlideIndex = slideCount - 1;
      } else if (index >= slideCount) {
        currentSlideIndex = 0;
      } else {
        currentSlideIndex = index;
      }
      
      // Geser slider berdasarkan persentase lebar container
      slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      updateDots();
    }

    // Klik tombol Kanan / Kiri
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex - 1);
      resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex + 1);
      resetAutoplay();
    });

    // Fitur Autoplay
    function startAutoplay() {
      autoplayTimer = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
      }, 5000); // Geser setiap 5 detik
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    // Pause autoplay jika mouse berada di atas slider
    const sliderContainer = document.querySelector('.testimonial-carousel');
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(autoplayTimer);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
      startAutoplay();
    });

    // Mulai autoplay saat load
    startAutoplay();
  }


  /* ==========================================
     9. LIGHTBOX MODAL (GALERI FOTO INTERAKTIF)
     ========================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close-btn');
  const lightboxPrev = lightbox.querySelector('.lightbox-nav-left');
  const lightboxNext = lightbox.querySelector('.lightbox-nav-right');
  
  let currentGalleryIndex = 0;
  const galleryImagesData = [];

  // Ambil semua data gambar & caption dari markup galeri
  galleryItems.forEach((item, index) => {
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-title');
    const categoryEl = item.querySelector('.gallery-category');
    
    galleryImagesData.push({
      src: imgEl.getAttribute('src'),
      title: titleEl ? titleEl.textContent : 'Gambar Galeri',
      category: categoryEl ? categoryEl.textContent : ''
    });

    // Event click untuk membuka lightbox
    item.addEventListener('click', () => {
      currentGalleryIndex = index;
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    const data = galleryImagesData[index];
    lightboxImg.setAttribute('src', data.src);
    lightboxCaption.innerHTML = `<strong>${data.title}</strong><br><span style="font-size:0.85rem; color:var(--accent-light); font-weight:500;">${data.category}</span>`;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Nonaktifkan scroll halaman utama saat popup terbuka
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = ''; // Aktifkan kembali scroll halaman utama
  }

  function navigateLightbox(dir) {
    currentGalleryIndex += dir;
    if (currentGalleryIndex < 0) {
      currentGalleryIndex = galleryImagesData.length - 1;
    } else if (currentGalleryIndex >= galleryImagesData.length) {
      currentGalleryIndex = 0;
    }
    openLightbox(currentGalleryIndex);
  }

  // Event Listeners Lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });
  
  // Klik area background modal untuk menutup
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Dukungan tombol keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
  });


  /* ==========================================
     10. VALIDASI KONTAK FORM & CUSTOM TOAST
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Cegah pengiriman default page reload
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      
      let isFormValid = true;

      // 1. Validasi Nama Lengkap
      if (nameInput.value.trim() === '') {
        showInputError(nameInput, 'Nama lengkap tidak boleh kosong');
        isFormValid = false;
      } else if (nameInput.value.trim().length < 3) {
        showInputError(nameInput, 'Nama minimal terdiri dari 3 karakter');
        isFormValid = false;
      } else {
        clearInputError(nameInput);
      }

      // 2. Validasi Email (RegEx)
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (emailInput.value.trim() === '') {
        showInputError(emailInput, 'Alamat email tidak boleh kosong');
        isFormValid = false;
      } else if (!emailPattern.test(emailInput.value.trim())) {
        showInputError(emailInput, 'Format alamat email tidak valid');
        isFormValid = false;
      } else {
        clearInputError(emailInput);
      }

      // 3. Validasi Pesan
      if (messageInput.value.trim() === '') {
        showInputError(messageInput, 'Pesan tidak boleh kosong');
        isFormValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showInputError(messageInput, 'Isi pesan terlalu pendek (minimal 10 karakter)');
        isFormValid = false;
      } else {
        clearInputError(messageInput);
      }

      // Jika seluruh validasi terlewati
      if (isFormValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Efek loading tombol submit
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim...';
        
        // Simulasikan pengiriman data API (jeda waktu simulasian)
        setTimeout(() => {
          // Reset tombol dan input form
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          
          showToast(
            'Pesan Terkirim!',
            `Halo ${nameInput.value.trim()}, pesan Anda berhasil terkirim. Terima kasih!`,
            'success'
          );
          
          contactForm.reset();
        }, 1500);
      } else {
        showToast(
          'Gagal Mengirim',
          'Harap periksa kembali isian form yang masih salah.',
          'error'
        );
      }
    });

    // Event listener untuk menghapus status error ketika user mengetik
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearInputError(input);
      });
    });
  }

  function showInputError(inputElement, errorMessage) {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.add('invalid');
    const errorEl = formGroup.querySelector('.form-error-msg');
    if (errorEl) {
      errorEl.textContent = errorMessage;
    }
  }

  function clearInputError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.remove('invalid');
  }


  /* ==========================================
     11. TOAST ALERTS SYSTEM
     ========================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' 
      ? 'fa-solid fa-circle-check' 
      : 'fa-solid fa-circle-exclamation';
      
    toast.innerHTML = `
      <i class="${icon}"></i>
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger slide-in animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);
    
    // Hapus toast setelah 4 detik
    setTimeout(() => {
      toast.classList.remove('show');
      // Berikan waktu animasi slide-out selesai sebelum menghapus element dari DOM
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

});
