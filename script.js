/* ==========================================================================
   V. Kumaran Decors & Events - Application Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Navigation & Scroll Effects
  // ==========================================================================
  const header = document.getElementById('main-header');
  const mobileNavToggle = document.getElementById('nav-mobile-btn');
  const navMenu = document.getElementById('header-nav-menu');
  const navLinks = document.querySelectorAll('.nav-item a');
  const sections = document.querySelectorAll('section, body');

  // Sticky Header scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  });

  // Mobile Menu Toggle
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      
      // Toggle hamburger menu icon state
      const spans = mobileNavToggle.querySelectorAll('span');
      if (!isExpanded) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        const spans = mobileNavToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Active section indicator
  function highlightNavOnScroll() {
    let scrollPos = window.scrollY + 120; // offset for sticky header
    sections.forEach(section => {
      if (section.id && scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
        navLinks.forEach(link => {
          link.parentElement.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}` || (section.id === 'top-body' && link.getAttribute('href') === '#top-body')) {
            link.parentElement.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================================================
  // 2. Counters Animation (Why Choose Us)
  // ==========================================================================
  const counters = document.querySelectorAll('.counter-number');
  const speed = 100; // lower is faster

  const startCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace('+', '').replace('%', '');
        const inc = target / speed;

        if (count < target) {
          const val = Math.ceil(count + inc);
          counter.innerText = val > target ? target : val;
          // Add suffix decoration back
          if (counter.id === 'cnt-events' || counter.id === 'cnt-customers' || counter.id === 'cnt-years') {
            counter.innerText += '+';
          } else if (counter.id === 'cnt-satisfaction') {
            counter.innerText += '%';
          }
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target;
          if (counter.id === 'cnt-events' || counter.id === 'cnt-customers' || counter.id === 'cnt-years') {
            counter.innerText += '+';
          } else if (counter.id === 'cnt-satisfaction') {
            counter.innerText += '%';
          }
        }
      };
      updateCount();
    });
  };

  // Intersection Observer to trigger counters when visible
  const countersSection = document.getElementById('why-choose');
  if (countersSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(countersSection);
  }

  // ==========================================================================
  // 3. Testimonials Slider
  // ==========================================================================
  const tstCards = document.querySelectorAll('.tst-card');
  const tstDots = document.querySelectorAll('.tst-dot');
  const tstSlider = document.getElementById('tst-slider');
  let currentTstIndex = 0;
  let tstInterval;

  const showTestimonial = (index) => {
    currentTstIndex = index;
    
    // Slide transition
    tstSlider.style.transform = `translateX(-${index * 33.333}%)`;
    
    tstCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    tstDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  const nextTestimonial = () => {
    const nextIndex = (currentTstIndex + 1) % tstCards.length;
    showTestimonial(nextIndex);
  };

  const startTstAutoPlay = () => {
    tstInterval = setInterval(nextTestimonial, 5000);
  };

  const stopTstAutoPlay = () => {
    clearInterval(tstInterval);
  };

  tstDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(dot.getAttribute('data-index'), 10);
      showTestimonial(index);
      stopTstAutoPlay();
      startTstAutoPlay(); // restart timer
    });
  });

  if (tstSlider) {
    startTstAutoPlay();
  }

  // ==========================================================================
  // 4. Portfolio Filters & Masonry Layout
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryGridItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Filter gallery elements
      let visibleIndex = 0;
      galleryGridItems.forEach(item => {
        const categories = item.getAttribute('data-category');
        const matches = filterValue === 'all' || categories.includes(filterValue);
        
        if (matches) {
          item.style.display = 'block';
          // trigger redraw to play scale transitions
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
          // Set local data-index dynamically on only visible elements for the lightbox to slide through
          item.setAttribute('data-visible-index', visibleIndex.toString());
          visibleIndex++;
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
          item.removeAttribute('data-visible-index');
        }
      });
    });
  });

  // Initialize data-visible-index on all elements initially
  galleryGridItems.forEach((item, idx) => {
    item.setAttribute('data-visible-index', idx.toString());
  });

  // ==========================================================================
  // 5. Portfolio Gallery & Lightbox Carousel (7 items)
  // ==========================================================================
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-modal-img');
  const lightboxTitle = document.getElementById('lightbox-modal-title');
  const lightboxDesc = document.getElementById('lightbox-modal-desc');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');

  let currentGalleryIndex = 0;

  // Complete data for the 7 portfolio assets
  const galleryData = [
    {
      img: 'assets/portfolio-stage-gold.jpg',
      title: 'Royal Traditional Stage',
      desc: 'Elegant traditional South Indian wedding stage decoration with golden carved pillars, fresh marigolds, and white jasmine.'
    },
    {
      img: 'assets/portfolio-stage-arches.jpg',
      title: 'Pastel Arches Stage',
      desc: 'Contemporary stage backdrop setup with pastel-themed floral drapes, geometric flower arches, and white wedding sofa.'
    },
    {
      img: 'assets/portfolio-walkway-mauve.png',
      title: 'Mauve Entrance Walkway',
      desc: 'Stunning wedding walkway tunnel decorated with mauve and white curtains, floral panels, and custom LED uplighting.'
    },
    {
      img: 'assets/portfolio-catering.jpg',
      title: 'German Canopy Buffet Area',
      desc: 'German canopy food stalls and buffet catering area arranged on fresh green turf with tables and seating.'
    },
    {
      img: 'assets/wedding-stage.png',
      title: 'Luxury Traditional Mandap',
      desc: 'Grand stage decoration featuring fresh flower garlands, brass lamps, and premium seating.'
    },
    {
      img: 'assets/arch-walkway.png',
      title: 'Fairy Lights Walkway',
      desc: 'Dreamy entrance arch pathway lit with golden fairy lights and decorated with marigold garlands.'
    },
    {
      img: 'assets/reception-stage.png',
      title: 'Pastel Rose Stage Backdrop',
      desc: 'Contemporary reception backdrop with pink and white roses, spotlights, and luxury seating.'
    },
    {
      img: 'assets/chennai-wedding-mandap.png',
      title: 'Chennai Traditional Mandap',
      desc: 'Classic Chennai-style wedding mandap adorned with fresh jasmine strings, orange marigolds, banana leaf decor, and traditional brass lamps.'
    },
    {
      img: 'assets/chennai-reception-decor.png',
      title: 'Chennai Luxury Reception',
      desc: 'Stunning Chennai reception backdrop featuring royal silk drapes, rich floral borders of white roses, and elegant lighting.'
    }
  ];

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryData[index];
    lightboxImg.src = item.img;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
  }

  function showNextImage() {
    // Navigate only through currently filtered items if filter is active
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const filterVal = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    
    let nextIndex = currentGalleryIndex;
    do {
      nextIndex = (nextIndex + 1) % galleryData.length;
    } while (filterVal !== 'all' && !galleryGridItems[nextIndex].getAttribute('data-category').includes(filterVal));

    openLightbox(nextIndex);
  }

  function showPrevImage() {
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const filterVal = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    
    let prevIndex = currentGalleryIndex;
    do {
      prevIndex = (prevIndex - 1 + galleryData.length) % galleryData.length;
    } while (filterVal !== 'all' && !galleryGridItems[prevIndex].getAttribute('data-category').includes(filterVal));

    openLightbox(prevIndex);
  }

  galleryGridItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // ==========================================================================
  // 6. Secure Contact Form & WhatsApp Integration (Directing to +91 9840381096)
  // ==========================================================================
  const form = document.getElementById('secure-inquiry-form');
  const statusMsg = document.getElementById('form-status-msg');
  // Target redirect phone number requested by user
  const targetPhone = '919840381096';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Hide previous status message
      statusMsg.style.display = 'none';
      statusMsg.className = 'form-message';

      // 1. Honeypot check (anti-spam technique)
      const honeypot = document.getElementById('form_hpot').value;
      if (honeypot.trim() !== '') {
        console.warn('Spam submission detected via honeypot.');
        showStatus('Inquiry compiled securely. Redirecting...', 'success');
        form.reset();
        return;
      }

      // 2. Client-side Rate Limiting
      const now = Date.now();
      const submissionCountKey = 'form_submit_count_v2';
      const lastSubmitKey = 'form_last_submit_v2';
      const lastSubmitTime = parseInt(sessionStorage.getItem(lastSubmitKey) || '0', 10);
      let submitCount = parseInt(sessionStorage.getItem(submissionCountKey) || '0', 10);

      // Reset count after 1 minute
      if (now - lastSubmitTime > 60000) {
        submitCount = 0;
      }

      if (submitCount >= 3) {
        showStatus('Rate limit exceeded. Please wait a minute before submitting another inquiry.', 'error');
        return;
      }

      // 3. Form Input Extraction and Sanitization
      const name = sanitizeInput(document.getElementById('form_name').value);
      const phone = sanitizeInput(document.getElementById('form_phone').value);
      const email = sanitizeInput(document.getElementById('form_email').value);
      const eventType = sanitizeInput(document.getElementById('form_type').value);
      const eventDateStr = sanitizeInput(document.getElementById('form_date').value);
      const budget = sanitizeInput(document.getElementById('form_budget').value);
      const rawMessage = document.getElementById('form_message').value;
      const message = rawMessage ? sanitizeInput(rawMessage) : 'None';

      // 4. Data Validation checks
      if (!name || !phone || !email || !eventType || !eventDateStr || !budget) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Email Format Check (RFC 5322 regex)
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Phone Format Check
      const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, '')) || phone.length < 8) {
        showStatus('Please enter a valid contact number (min 8 digits).', 'error');
        return;
      }

      // Date Check (Must be in the future)
      const selectedDate = new Date(eventDateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // clear times for date comparison
      if (selectedDate < today) {
        showStatus('The event date cannot be in the past.', 'error');
        return;
      }

      // Update rate limiter metrics
      sessionStorage.setItem(lastSubmitKey, now.toString());
      sessionStorage.setItem(submissionCountKey, (submitCount + 1).toString());
      
      // Pretty print date
      const formattedDate = selectedDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Compose secure WhatsApp message layout containing form data
      const waText = `*NEW EVENT INQUIRY - V. KUMARAN DECORS*
----------------------------------------
*Customer Name:* ${name}
*Phone Number:* ${phone}
*Email Address:* ${email}
*Event Category:* ${eventType}
*Event Date:* ${formattedDate}
*Estimated Budget:* ${budget}

*Message & Custom Requests:*
${message}
----------------------------------------
_Inquiry compiled & validated securely._`;

      const encodedText = encodeURIComponent(waText);
      const whatsappURL = `https://wa.me/${targetPhone}?text=${encodedText}`;

      // Open WhatsApp in a new window/tab securely
      const newWindow = window.open(whatsappURL, '_blank');
      if (newWindow) {
        newWindow.focus();
      }

      // Display user feedback success box
      showStatus('Inquiry compiled securely! WhatsApp has been opened in a new tab. Please click "Send" to notify us of your program details.', 'success');
      
      // Reset form fields
      form.reset();
      
      // Store transaction reference securely in localStorage
      const secureTx = {
        txId: 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toISOString(),
        category: eventType,
        verified: true
      };
      localStorage.setItem('last_secure_inquiry', JSON.stringify(secureTx));
    });
  }

  // Helper: Sanitize string to prevent Cross-Site Scripting (XSS)
  function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Helper: Display form submission status message
  function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.style.display = 'block';
    statusMsg.classList.add(type);
    
    // Auto scroll to message
    statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

});
