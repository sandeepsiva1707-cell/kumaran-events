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
  // 4. Cloudinary Dynamic Portfolio & Fallback Gallery
  // ==========================================================================
   let galleryData = [];
   let galleryGridItems = [];
   let currentGalleryIndex = 0;

  function formatTitle(publicId, categoryName) {
    const filename = publicId.split('/').pop();
    let clean = filename
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/^(portfolio|img|image|photo)-/i, "") // remove prefixes
      .replace(/[-_]/g, " "); // replace dashes/underscores with spaces
      
    clean = clean.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    if (clean.length < 3) {
      return categoryName;
    }
    return clean;
  }

  function formatDescription(title, categoryName) {
    return `Beautiful ${categoryName} setup featuring ${title}, customized and organized by V. Kumaran Decors & Events in Arani.`;
  }

  // Initial grid rendering (dynamic based on galleryData loaded from Cloudinary)
  const renderGrid = () => {
    const grid = document.getElementById('gal-grid');
    if (!grid) return;

    grid.innerHTML = '';

    galleryData.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.setAttribute('data-index', idx.toString());
      el.setAttribute('data-category', item.category);
      
      el.innerHTML = `
        <img class="gallery-img" src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="gallery-overlay">
          <div class="gallery-info">
            <span class="gallery-tag">${item.categoryName}</span>
            <h4>${item.title}</h4>
            <button class="view-btn">View Image</button>
          </div>
        </div>
      `;
      grid.appendChild(el);
    });

    // Re-select items
    galleryGridItems = document.querySelectorAll('.gallery-item');
    
    // Bind click events
    galleryGridItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        openLightbox(index);
      });
    });

    // Apply Intersection Observer
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    galleryGridItems.forEach(el => {
      el.classList.add('fade-up-init');
      scrollObserver.observe(el);
    });

    // Initial limit (9 visible items for default 'all' view)
    let initialVisibleIndex = 0;
    galleryGridItems.forEach((item, idx) => {
      if (idx < 9) {
        item.setAttribute('data-visible-index', initialVisibleIndex.toString());
        initialVisibleIndex++;
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item.removeAttribute('data-visible-index');
      }
    });
  };

  // Filter initialization function - selects buttons dynamically from latest DOM state
  const setupFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        let visibleIndex = 0;
        galleryGridItems.forEach(item => {
          const categories = item.getAttribute('data-category');
          const matchesCategory = filterValue === 'all' || categories === filterValue;
          const matchesLimit = filterValue !== 'all' || visibleIndex < 9;
          const matches = matchesCategory && matchesLimit;
          
          if (matches) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
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
  };

  // Main loader for Cloudinary listing supporting serverless API route and public API fallback
  const loadCloudinaryGallery = () => {
    if (galleryStatus) {
      galleryStatus.textContent = 'Loading live gallery updates...';
      galleryStatus.classList.add('active');
    }

    const isLocalFile = window.location.protocol === 'file:';
    // Use Serverless backend if served over HTTP/HTTPS, fallback to public List API locally
    const primaryUrl = isLocalFile ? listUrl : '/api/gallery';

    console.log(`[Gallery] Loading from: ${primaryUrl}`);

    const processGalleryData = (data) => {
      if (!data || !data.resources || data.resources.length === 0) {
        throw new Error('No images found in Cloudinary for tag ' + tag);
      }

      // Map Cloudinary images and extract folder categories
      const cloudImages = data.resources.map(res => {
        const parts = res.public_id.split('/');
        const folderName = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
        const categoryId = folderName 
          ? folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
          : 'uncategorized';
        const categoryName = folderName || 'Uncategorized';
        
        const title = formatTitle(res.public_id, categoryName);
        const desc = formatDescription(title, categoryName);
        
        // Apply Cloudinary automatic format/quality optimizations and width limits
        const imgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_600/v${res.version}/${res.public_id}.${res.format}`;
        const fullImgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1600/v${res.version}/${res.public_id}.${res.format}`;
        
        return {
          img: imgUrl,
          fullImg: fullImgUrl,
          title: title,
          desc: desc,
          category: categoryId,
          categoryName: categoryName,
          date: new Date(res.created_at)
        };
      });

      // Sort Cloudinary images by date uploaded (newest first)
      cloudImages.sort((a, b) => b.date - a.date);

      // Remove dependency on fallback gallery completely
      galleryData = cloudImages;

      // Extract unique categories from the Cloudinary images
      const uniqueCategoriesMap = new Map();
      cloudImages.forEach(img => {
        if (img.category !== 'uncategorized') {
          uniqueCategoriesMap.set(img.category, img.categoryName);
        }
      });
      
      const sortedCategories = Array.from(uniqueCategoriesMap.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Build the filter buttons dynamically in the DOM
      const filtersContainer = document.getElementById('gal-filters');
      if (filtersContainer) {
        filtersContainer.innerHTML = '';
        
        // Create "All" button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.setAttribute('data-filter', 'all');
        allBtn.textContent = 'All Portfolio';
        filtersContainer.appendChild(allBtn);
        
        // Create category buttons
        sortedCategories.forEach(cat => {
          const btn = document.createElement('button');
          btn.className = 'filter-btn';
          btn.setAttribute('data-filter', cat.id);
          btn.textContent = cat.name;
          filtersContainer.appendChild(btn);
        });
      }

      // Render the new items dynamically
      renderGrid();
      
      // Wire up filters for the new buttons
      setupFilters();

      // Update status message
      if (galleryStatus) {
        galleryStatus.textContent = '✓ Live portfolio updates loaded';
        setTimeout(() => {
          galleryStatus.classList.remove('active');
        }, 3000);
      }

      // Apply active filter state
      const activeBtn = document.querySelector('.filter-btn.active');
      if (activeBtn) activeBtn.click();
    };

    const extractErrorMsg = async (response) => {
      const cldError = response.headers.get('x-cld-error');
      if (cldError) return cldError;
      try {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          return data.details || data.error || `HTTP ${response.status} ${response.statusText || ''}`;
        }
      } catch (e) {}
      return `HTTP ${response.status} ${response.statusText || ''}`;
    };

    const triggerLocalFallback = (error, context) => {
      console.error(`[Gallery] Failure in ${context}. details:`, {
        message: error.message,
        error: error,
        endpoint: primaryUrl,
        file: 'script.js',
        line: 688
      });
      if (galleryStatus) {
        galleryStatus.innerHTML = `⚠️ Displaying offline gallery. Cloudinary connection error: ${error.message}`;
        galleryStatus.classList.add('active');
      }
    };

    fetch(primaryUrl)
      .then(async response => {
        if (!response.ok) {
          const msg = await extractErrorMsg(response);
          throw new Error(msg);
        }
        return response.json();
      })
      .then(data => {
        processGalleryData(data);
      })
      .catch(primaryError => {
        console.warn(`[Gallery] Primary loading failed: ${primaryError.message}. Trying public list fallback.`);
        
        if (primaryUrl !== listUrl) {
          fetch(listUrl)
            .then(async response => {
              if (!response.ok) {
                const msg = await extractErrorMsg(response);
                throw new Error(msg);
              }
              return response.json();
            })
            .then(data => {
              processGalleryData(data);
            })
            .catch(fallbackError => {
              triggerLocalFallback(fallbackError, 'both Serverless API and Cloudinary public List API');
            });
        } else {
          triggerLocalFallback(primaryError, 'primary Cloudinary public List API');
        }
      });
  };
  // ==========================================================================
  // 5. Lightbox Carousel Functions
  // ==========================================================================
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-modal-img');
  const lightboxTitle = document.getElementById('lightbox-modal-title');
  const lightboxDesc = document.getElementById('lightbox-modal-desc');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryData[index];
    // Prefer high-res dynamic fullImg from Cloudinary if available
    lightboxImg.src = item.fullImg || item.img;
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
    const visibleItems = Array.from(galleryGridItems)
      .filter(item => item.hasAttribute('data-visible-index'))
      .sort((a, b) => parseInt(a.getAttribute('data-visible-index'), 10) - parseInt(b.getAttribute('data-visible-index'), 10));
    
    if (visibleItems.length === 0) return;
    
    const currentItem = galleryGridItems[currentGalleryIndex];
    let visiblePos = visibleItems.indexOf(currentItem);
    
    if (visiblePos === -1) {
      visiblePos = 0;
    } else {
      visiblePos = (visiblePos + 1) % visibleItems.length;
    }
    
    const nextItemIndex = parseInt(visibleItems[visiblePos].getAttribute('data-index'), 10);
    openLightbox(nextItemIndex);
  }

  function showPrevImage() {
    const visibleItems = Array.from(galleryGridItems)
      .filter(item => item.hasAttribute('data-visible-index'))
      .sort((a, b) => parseInt(a.getAttribute('data-visible-index'), 10) - parseInt(b.getAttribute('data-visible-index'), 10));
    
    if (visibleItems.length === 0) return;
    
    const currentItem = galleryGridItems[currentGalleryIndex];
    let visiblePos = visibleItems.indexOf(currentItem);
    
    if (visiblePos === -1) {
      visiblePos = visibleItems.length - 1;
    } else {
      visiblePos = (visiblePos - 1 + visibleItems.length) % visibleItems.length;
    }
    
    const prevItemIndex = parseInt(visibleItems[visiblePos].getAttribute('data-index'), 10);
    openLightbox(prevItemIndex);
  }

  // Initialize gallery elements and try to fetch Cloudinary updates
  renderGrid();
  setupFilters();
  loadCloudinaryGallery();

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
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // ==========================================================================
  // 6. Secure Contact Form & WhatsApp Integration (Directing to +91 90438 93525)
  // ==========================================================================
  const form = document.getElementById('secure-inquiry-form');
  const statusMsg = document.getElementById('form-status-msg');
  // Target redirect phone number requested by user
  const targetPhone = '919043893525';

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

  // ==========================================================================
  // 7. Scroll Animation Observer (Fade-up)
  // ==========================================================================
  const fadeUpElements = document.querySelectorAll('.gallery-item, .service-card, .timeline-item, .counter-card');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  fadeUpElements.forEach(el => {
    el.classList.add('fade-up-init');
    scrollObserver.observe(el);
  });

  // ==========================================================================
  // 8. Mobile Swipe Support for Lightbox
  // ==========================================================================
  let touchStartX = 0;
  let touchEndX = 0;
  const lightboxContent = document.querySelector('.lightbox-content');
  
  if (lightboxContent) {
    lightboxContent.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightboxContent.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });
  }
  
  function handleSwipeGesture() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      showNextImage();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      showPrevImage();
    }
  }

});
