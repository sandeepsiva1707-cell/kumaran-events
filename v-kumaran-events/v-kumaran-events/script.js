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
  const CATEGORIES = [
    { id: 'entrance-gate', name: 'Entrance Gate', folders: ['entrance gate', 'entrance-gate'] },
    { id: 'welcome-entrance', name: 'Welcome Entrance', folders: ['welcome entrance', 'welcome-entrance'] },
    { id: 'hall-decoration', name: 'Hall Decoration', folders: ['hall decoration', 'hall-decoration'] },
    { id: 'reception-stage', name: 'Reception Stage', folders: ['reception stage', 'reception-stage'] },
    { id: 'wedding-decor', name: 'Wedding Decor', folders: ['wedding decor', 'wedding-decor'] },
    { id: 'garland', name: 'Garland', folders: ['garland'] },
    { id: 'aarthi-plates', name: 'Aarthi Plates', folders: ['aarthi plates', 'aarthi-plates'] },
    { id: 'birthday', name: 'Birthday', folders: ['birthday'] },
    { id: 'welcome-girls', name: 'Welcome Girls', folders: ['welcome girls', 'welcome-girls'] },
    { id: 'photobooth', name: 'Photo Booth', folders: ['photo booth', 'photo-booth', 'photobooth'] },
    { id: 'bouncer', name: 'Bouncers', folders: ['bouncers', 'bouncer'] },
    { id: 'car-decoration', name: 'Car Decoration', folders: ['car decoration', 'car-decoration'] }
  ];

  const cloudName = 'ktohexmm';
  const tag = 'kumaran-gallery';
  const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`;

  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryStatus = document.getElementById('gallery-status');
  let galleryGridItems = document.querySelectorAll('.gallery-item');
  let currentGalleryIndex = 0;

  // Local static fallback data in case Cloudinary is offline or before tags are set up
  let galleryData = [
    {
      img: 'assets/portfolio-stage-gold.jpg',
      title: 'Royal Traditional Stage',
      desc: 'Elegant traditional South Indian wedding stage decoration with golden carved pillars, fresh marigolds, and white jasmine.',
      category: 'wedding-decor',
      categoryName: 'Wedding Decor'
    },
    {
      img: 'assets/portfolio-stage-arches.jpg',
      title: 'Pastel Arches Stage',
      desc: 'Contemporary stage backdrop setup with pastel-themed floral drapes, geometric flower arches, and white wedding sofa.',
      category: 'reception-stage',
      categoryName: 'Reception Stage'
    },
    {
      img: 'assets/portfolio-walkway-mauve.png',
      title: 'Mauve Entrance Walkway',
      desc: 'Stunning wedding walkway tunnel decorated with mauve and white curtains, floral panels, and custom LED uplighting.',
      category: 'welcome-entrance',
      categoryName: 'Welcome Entrance'
    },
    {
      img: 'assets/portfolio-hall-decor-white.jpg',
      title: 'White Floral Hall Decor',
      desc: 'Stunning stage decoration with a grand white floral arch backdrop, gold seating couch, and fresh flower decorations.',
      category: 'hall-decoration',
      categoryName: 'Hall Decoration'
    },
    {
      img: 'assets/portfolio-hall-decor-gold.jpg',
      title: 'Golden Theme Hall Decor',
      desc: 'Luxury wedding hall setup with golden arches, rich traditional lighting, and an elegant maharaja sofa.',
      category: 'hall-decoration',
      categoryName: 'Hall Decoration'
    },
    {
      img: 'assets/portfolio-selfiebooth.png',
      title: 'Welcome Board Easel',
      desc: 'Traditional wedding welcome easel board decorated with floral garlands, warm fairy lights, and vintage white birdcages.',
      category: 'photobooth',
      categoryName: 'Photo Booth'
    },
    {
      img: 'assets/portfolio-entrance-walkway.png',
      title: 'Yellow Entrance Walkway',
      desc: 'Stunning event entrance walkway tunnel featuring yellow fabric draping, warm LED lighting columns, and white window arches.',
      category: 'welcome-entrance',
      categoryName: 'Welcome Entrance'
    },
    {
      img: 'assets/portfolio-stage-pink.png',
      title: 'Pink Lotus Backdrop',
      desc: 'Elegant stage backdrop featuring hand-painted pink lotus flowers, matching pink floral borders, and hanging marigold garlands.',
      category: 'wedding-decor',
      categoryName: 'Wedding Decor'
    },
    {
      img: 'assets/portfolio-stage-white.jpg',
      title: 'White Stage Backdrop',
      desc: 'Premium modern stage setup featuring geometric panels, fresh floral arches, and wedding couches.',
      category: 'reception-stage',
      categoryName: 'Reception Stage'
    },
    {
      img: 'assets/portfolio-welcome-girls-1.jpg',
      title: 'Event Coordinator Team',
      desc: 'Professional event coordination girls and hostesses in smart uniforms, equipped for guest reception and coordination details.',
      category: 'welcome-girls',
      categoryName: 'Welcome Girls'
    },
    {
      img: 'assets/portfolio-welcome-girls-2.jpg',
      title: 'Traditional Hostesses',
      desc: 'Welcome girls in beautiful blue and yellow traditional floral saris, standing next to the welcome sign easel.',
      category: 'welcome-girls',
      categoryName: 'Welcome Girls'
    },
    {
      img: 'assets/portfolio-welcome-girls-3.jpg',
      title: 'Royal Event Welcome Team',
      desc: 'Traditional welcome girls in coordinating beige and purple border saris, presenting at the guest reception area.',
      category: 'welcome-girls',
      categoryName: 'Welcome Girls'
    },
    {
      img: 'assets/portfolio-bouncers-1.jpg',
      title: 'Elite Security Team',
      desc: 'Professional male security bouncers in black uniforms standing in line at the venue entrance.',
      category: 'bouncer',
      categoryName: 'Bouncers'
    },
    {
      img: 'assets/portfolio-bouncers-2.jpg',
      title: 'Security Crew',
      desc: 'Professional male bouncers and crowd management team standing in a marriage hall during an event.',
      category: 'bouncer',
      categoryName: 'Bouncers'
    },
    {
      img: 'assets/portfolio-garland-couple.png',
      title: 'Bridal Rose Garland',
      desc: 'Exquisite red rose wedding garlands accented with gold beads, held during a traditional Indian marriage ceremony.',
      category: 'garland',
      categoryName: 'Garland'
    },
    {
      img: 'assets/portfolio-garland-vertical.jpg',
      title: 'Traditional Jasmine Garland',
      desc: 'Premium flower garlands handcrafted with fresh red roses, white jasmine buds, and gold ornamental trims.',
      category: 'garland',
      categoryName: 'Garland'
    },
    {
      img: 'assets/portfolio-photobooth-neon.jpg',
      title: 'Neon Backdrop Photobooth',
      desc: 'Lush green foliage backdrop accented with white roses, hanging leaves, and a customizable neon sign.',
      category: 'photobooth',
      categoryName: 'Photo Booth'
    },
    {
      img: 'assets/portfolio-photobooth-ringlight.jpg',
      title: 'Foliage Wall Photobooth',
      desc: 'Interactive photo booth corner complete with a green floral wall backdrop, ring light setup, and guest area.',
      category: 'photobooth',
      categoryName: 'Photo Booth'
    },
    {
      img: 'assets/portfolio-birthday-arch.jpg',
      title: 'Circular Balloon Backdrop',
      desc: 'Beautiful round backdrop with blue, pink, and gold balloon decorations and a Happy Birthday neon light.',
      category: 'birthday',
      categoryName: 'Birthday'
    },
    {
      img: 'assets/portfolio-birthday-cocomelon.jpg',
      title: 'Cocomelon Theme Backdrop',
      desc: 'Lively kids birthday party backdrop featuring Cocomelon character designs, balloon arches, and Yazhisai letter light boards.',
      category: 'birthday',
      categoryName: 'Birthday'
    },
    {
      img: 'assets/portfolio-birthday-raha.jpg',
      title: 'Raha 1st Birthday Backdrop',
      desc: 'Premium kids birthday theme decor with blue, white, and gold balloon clusters, a circular stage board, and custom neon lights.',
      category: 'birthday',
      categoryName: 'Birthday'
    },
    {
      img: 'assets/portfolio-walkway-pink-arches.png',
      title: 'Pink Illuminated Walkway',
      desc: 'Stunning walkway entrance setup with pink and purple illumination, white floral window panels, and ceiling drapes.',
      category: 'welcome-entrance',
      categoryName: 'Welcome Entrance'
    },
    {
      img: 'assets/portfolio-entrance-banana-leaf.jpg',
      title: 'Traditional Banana Leaf Entrance',
      desc: 'Classic South Indian wedding entrance decorated with banana leaves, fresh marigold garlands, and ornamental leaf star designs.',
      category: 'entrance-gate',
      categoryName: 'Entrance Gate'
    },
    {
      img: 'assets/portfolio-entrance-gold-banana.jpg',
      title: 'Golden Traditional Entrance',
      desc: 'Elegant golden entrance arch featuring traditional flower decorations, hanging banana bunches, and fresh marigold borders.',
      category: 'entrance-gate',
      categoryName: 'Entrance Gate'
    },
    {
      img: 'assets/portfolio-entrance-royal-gold.png',
      title: 'Royal Golden Entrance Arch',
      desc: 'Grand event entrance gate featuring royal golden carvings, matching side panels, and beautiful red flower accents.',
      category: 'entrance-gate',
      categoryName: 'Entrance Gate'
    },
    {
      img: 'assets/portfolio-walkway-traditional-ganesha.jpg',
      title: 'Traditional Ganesha Walkway',
      desc: 'Elegant wedding entrance pathway featuring red and yellow fabric drapes, hanging brass bells, and a golden Ganesha idol.',
      category: 'welcome-entrance',
      categoryName: 'Welcome Entrance'
    },
    {
      img: 'assets/portfolio-welcome-white-arch.jpg',
      title: 'White Arch Entrance Passage',
      desc: 'Magnificent welcome walkway featuring a series of white floral arches, red carpet, and pink flower borders.',
      category: 'welcome-entrance',
      categoryName: 'Welcome Entrance'
    },
    {
      img: 'assets/portfolio-welcome-banners.jpg',
      title: 'Welcome Banners Walkway',
      desc: 'Stunning outdoor welcome entrance pathway decorated with bright red curtains, custom welcome banners, and floral arches.',
      category: 'welcome-entrance',
      categoryName: 'Welcome Entrance'
    },
    {
      img: 'assets/portfolio-welcome-bells-path.jpg',
      title: 'Traditional Ganesha & Bells Entrance',
      desc: 'Stately welcome walkway decorated with golden lighting strings, traditional hanging bells, and a central Ganesha statue.',
      category: 'welcome-entrance',
      categoryName: 'Welcome Entrance'
    },
    {
      img: 'assets/portfolio-aarthi-plate-1.jpg',
      title: 'Traditional Decorated Aarthi Plates & Dolls',
      desc: 'Exquisite display of hand-decorated Aarthi plates, traditional dolls, and festival items on a green and red table setup.',
      category: 'aarthi-plates',
      categoryName: 'Aarthi Plates'
    },
    {
      img: 'assets/portfolio-aarthi-plate-2.jpg',
      title: 'Festival Aarthi Plates & Doll Display',
      desc: 'Detailed showcase of multiple customized Aarthi plates, brass lamps, and traditional dolls for wedding ceremonies.',
      category: 'aarthi-plates',
      categoryName: 'Aarthi Plates'
    },
    {
      img: 'assets/portfolio-car-innova.png',
      title: 'Premium Floral Car Decor',
      desc: 'Silver Innova luxury wedding car decorated with fresh red gerbera flowers and floral bouquets.',
      category: 'car-decoration',
      categoryName: 'Car Decoration'
    },
    {
      img: 'assets/portfolio-car-jaguar.jpg',
      title: 'Royal Net & Flower Car Decor',
      desc: 'White Jaguar premium wedding car styled with elegant pink and purple netting and fresh flower details.',
      category: 'car-decoration',
      categoryName: 'Car Decoration'
    },
    {
      img: 'assets/portfolio-car-skoda.png',
      title: 'Elegant Rose & Frame Car Decor',
      desc: 'Black Skoda wedding car decorated with fresh pink roses, green foliage, and a personalized couple frame.',
      category: 'car-decoration',
      categoryName: 'Car Decoration'
    },
    {
      img: 'assets/portfolio-stage-jasmine-arches.png',
      title: 'Traditional Jasmine Stage Arches',
      desc: 'Elegant wedding stage decoration featuring hanging jasmine flower garlands arranged in beautiful overlapping arches against a warm golden backdrop.',
      category: 'wedding-decor',
      categoryName: 'Wedding Decor'
    },
    {
      img: 'assets/portfolio-stage-golden-mandap.jpg',
      title: 'Golden Temple Mandap Setup',
      desc: 'Magnificent gold wedding mandap setup designed like a traditional temple dome, adorned with colorful flower garlands and flanking deities.',
      category: 'wedding-decor',
      categoryName: 'Wedding Decor'
    },
    {
      img: 'assets/portfolio-garland-pink-white.jpg',
      title: 'Pink & White Rose Garland',
      desc: 'Beautifully handcrafted wedding garlands featuring alternating layers of fresh pink and white roses with delicate baby\'s breath.',
      category: 'garland',
      categoryName: 'Garland'
    },
    {
      img: 'assets/portfolio-garland-white-rose.png',
      title: 'Elegant White Rose Garland',
      desc: 'Premium white rose wedding garland woven with baby\'s breath, accompanied by a matching bridal flower bouquet.',
      category: 'garland',
      categoryName: 'Garland'
    },
    {
      img: 'assets/portfolio-bouncers-3.jpg',
      title: 'Professional Security Crew',
      desc: 'Professional crowd management and security team of four bouncers, stationed at the venue entrance.',
      category: 'bouncer',
      categoryName: 'Bouncers'
    },
    {
      img: 'assets/portfolio-car-audi.jpg',
      title: 'Luxury Audi Wedding Car Decor',
      desc: 'Red Audi cabriolet premium wedding car decorated with flower bouquet and ribbons.',
      category: 'car-decoration',
      categoryName: 'Car Decoration'
    },
    {
      img: 'assets/portfolio-stage-ganesha.jpg',
      title: 'Golden Ganesha Stage Backdrop',
      desc: 'Golden stage decoration with central Ganesha design and flower garlands.',
      category: 'wedding-decor',
      categoryName: 'Wedding Decor'
    },
    {
      img: 'assets/portfolio-stage-circular-gold.png',
      title: 'Circular Golden Mandap Decor',
      desc: 'Circular gold mandap stage setup with flower garlands and hanging details.',
      category: 'reception-stage',
      categoryName: 'Reception Stage'
    },
    {
      img: 'assets/portfolio-entrance-pink-white.jpg',
      title: 'Curtained Floral Entrance Setup',
      desc: 'Stunning entrance walkway decorated with pink and white curtains and fresh flower garlands.',
      category: 'entrance-gate',
      categoryName: 'Entrance Gate'
    }
  ];

  // Helper functions for parsing publicId
  function detectCategory(publicId) {
    const parts = publicId.toLowerCase().split('/');
    for (let part of parts) {
      const normalizedPart = part.replace(/[^a-z0-9]/g, '');
      for (const cat of CATEGORIES) {
        for (const f of cat.folders) {
          const normalizedFolder = f.replace(/[^a-z0-9]/g, '');
          if (normalizedPart === normalizedFolder) {
            return cat;
          }
        }
      }
    }
    // Substring fallback
    const cleanPublicId = publicId.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const cat of CATEGORIES) {
      for (const f of cat.folders) {
        const normalizedFolder = f.replace(/[^a-z0-9]/g, '');
        if (cleanPublicId.includes(normalizedFolder)) {
          return cat;
        }
      }
    }
    // Default to Wedding Decor
    return CATEGORIES.find(c => c.id === 'wedding-decor') || CATEGORIES[4];
  }

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

  // Filter initialization function
  const setupFilters = () => {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        let visibleIndex = 0;
        galleryGridItems.forEach(item => {
          const categories = item.getAttribute('data-category');
          const matchesCategory = filterValue === 'all' || categories.includes(filterValue);
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

  // Initial grid rendering (runs immediately using fallback, updated if Cloudinary successfully loads)
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

  // Main loader for Cloudinary listing
  const loadCloudinaryGallery = () => {
    if (galleryStatus) {
      galleryStatus.textContent = 'Loading live gallery updates...';
      galleryStatus.classList.add('active');
    }

    fetch(listUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Cloudinary Resource List API is disabled or returned an error.');
        }
        return response.json();
      })
      .then(data => {
        if (!data || !data.resources || data.resources.length === 0) {
          throw new Error('No images found in Cloudinary for tag ' + tag);
        }

        // Map Cloudinary images
        const cloudImages = data.resources.map(res => {
          const cat = detectCategory(res.public_id);
          const title = formatTitle(res.public_id, cat.name);
          const desc = formatDescription(title, cat.name);
          
          // Apply Cloudinary automatic format/quality optimizations and width limits
          const imgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_600/v${res.version}/${res.public_id}.${res.format}`;
          const fullImgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1600/v${res.version}/${res.public_id}.${res.format}`;
          
          return {
            img: imgUrl,
            fullImg: fullImgUrl,
            title: title,
            desc: desc,
            category: cat.id,
            categoryName: cat.name,
            date: new Date(res.created_at)
          };
        });

        // Sort Cloudinary images by date uploaded (newest first)
        cloudImages.sort((a, b) => b.date - a.date);

        // Keep local fallback images that were not migrated to Cloudinary
        const mergedImages = [...cloudImages];
        galleryData.forEach(fallbackItem => {
          const isUploaded = cloudImages.some(cloudItem => {
            const fallbackName = fallbackItem.img.split('/').pop().split('.')[0];
            return cloudItem.img.includes(fallbackName);
          });
          
          if (!isUploaded) {
            mergedImages.push(fallbackItem);
          }
        });

        // Set the active gallery data to the merged result
        galleryData = mergedImages;

        // Render the new items dynamically
        renderGrid();

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
      })
      .catch(error => {
        console.warn('Using local fallback portfolio gallery: ', error.message);
        if (galleryStatus) {
          galleryStatus.innerHTML = '⚠️ Displaying offline gallery. Cloudinary updates temporarily unavailable.';
          galleryStatus.classList.add('active');
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
