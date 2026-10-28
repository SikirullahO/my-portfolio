
(() => {
  'use strict';

 
  document.documentElement.classList.add('js-enabled');

  /* =========================================================================
     1. EDITABLE CONTENT
     ========================================================================= */

  const SOCIAL_LINKS = {
    github: 'https://github.com/SikirullahO',
    linkedin: '',
    email: '',
  };

  /** Labels for the project filters and categories. */
  const CATEGORY_LABELS = {
    web: 'Web Development',
    ai: 'AI Engineering',
  };

  /** Allowed project statuses and how they are shown. */
  const STATUS_LABELS = {
    planned: 'Planned',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  const PROJECTS = [
    {
      title: 'PDF Chat with RAG',
      description:
        'A document question-answering app that retrieves relevant passages from uploaded PDFs and generates answers grounded in that content.',
      tags: ['Python', 'FastAPI', 'OpenAI API', 'RAG'],
      categories: ['ai'],
      status: 'planned',
      repoUrl: '',
      demoUrl: '',
      visual: 'document',
    },
    {
      title: 'Website Knowledge Assistant',
      description:
        'An assistant that answers questions using information retrieved from website pages and documentation, so replies point back to real content.',
      tags: ['Python', 'FastAPI', 'JavaScript', 'LLM APIs'],
      categories: ['ai', 'web'],
      status: 'planned',
      repoUrl: '',
      demoUrl: '',
      visual: 'knowledge',
    },
    {
      title: 'AI Workflow Agent',
      description:
        'An experiment in how an agent can use a small set of controlled tools to complete structured, multi-step tasks predictably.',
      tags: ['Python', 'LLM APIs', 'Tool calling'],
      categories: ['ai'],
      status: 'planned',
      repoUrl: '',
      demoUrl: '',
      visual: 'agent',
    },
    {
      title: 'Responsive Personal Portfolio',
      description:
        'This website: a fast, accessible portfolio presenting my interests, learning journey, skills and projects, built without frameworks.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      categories: ['web'],
      status: 'in-progress',
      repoUrl: '',
      demoUrl: '',
      visual: 'layout',
    },
  ];

  /* =========================================================================
     2. HELPER FUNCTIONS
     ========================================================================= */

  /** Returns the first element matching a CSS selector, or null. */
  function findElement(selector, searchRoot = document) {
    return searchRoot.querySelector(selector);
  }

  /** Returns every element matching a CSS selector, as a normal array. */
  function findAllElements(selector, searchRoot = document) {
    return Array.from(searchRoot.querySelectorAll(selector));
  }

  function userPrefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** True only for a non-empty, absolute http(s) URL. */
  function isWebAddress(possibleUrl) {
    if (typeof possibleUrl !== 'string' || !possibleUrl.trim()) return false;
    try {
      const parsedUrl = new URL(possibleUrl.trim());
      return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
    } catch (parseError) {
      return false;
    }
  }

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /** Runs a callback whenever a media query starts or stops matching. */
  function watchMediaQuery(mediaQueryText, onChange) {
    const mediaQueryList = window.matchMedia(mediaQueryText);
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', onChange);
    } else if (mediaQueryList.addListener) {
      mediaQueryList.addListener(onChange); // older Safari
    }
    return mediaQueryList;
  }

  /** Creates an element with an optional class name and text content. */
  function createElementWith(tagName, className, textContent) {
    const newElement = document.createElement(tagName);
    if (className) newElement.className = className;
    if (textContent !== undefined) newElement.textContent = textContent;
    return newElement;
  }

  /** Inline icons used by generated content (static, author-defined markup). */
  const ICON_MARKUP = {
    github:
      '<svg class="icon icon--fill" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>',
    external:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    clock:
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };

  /** Decorative project illustrations. Colours come from CSS (.pv-* classes). */
  const PROJECT_ILLUSTRATIONS = {
    document: `
      <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false">
        <rect class="pv-panel" x="36" y="12" width="66" height="92" rx="8"/>
        <path class="pv-line" d="M48 32h42M48 44h42M48 56h28M48 68h36M48 80h22"/>
        <rect class="pv-block--soft" x="44" y="50" width="50" height="24" rx="4"/>
        <path class="pv-line pv-line--accent pv-dash" d="M108 62h28"/>
        <circle class="pv-dot" cx="140" cy="62" r="4"/>
        <rect class="pv-panel" x="150" y="32" width="64" height="42" rx="10"/>
        <path class="pv-panel" d="M164 73l-6 13 17-13z"/>
        <path class="pv-line pv-line--accent" d="M162 46h40M162 58h26"/>
      </svg>`,
    knowledge: `
      <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false">
        <rect class="pv-panel" x="24" y="16" width="100" height="80" rx="8"/>
        <path class="pv-line" d="M24 32h100" style="stroke-width:1.5"/>
        <circle class="pv-dot--muted" cx="35" cy="24" r="2.5"/>
        <circle class="pv-dot--muted" cx="44" cy="24" r="2.5"/>
        <circle class="pv-dot--muted" cx="53" cy="24" r="2.5"/>
        <path class="pv-line" d="M38 48h60M38 60h72M38 72h44M38 84h56"/>
        <path class="pv-line pv-line--accent2 pv-dash" d="M126 56h26"/>
        <circle class="pv-ring" cx="178" cy="56" r="24"/>
        <path class="pv-accent2" d="M178 40l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"/>
      </svg>`,
    agent: `
      <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false">
        <path class="pv-line pv-dash" d="M62 60h36M142 60h36M120 31v9M120 80v9"/>
        <rect class="pv-panel" x="30" y="46" width="30" height="28" rx="7"/>
        <rect class="pv-panel" x="180" y="46" width="30" height="28" rx="7"/>
        <rect class="pv-panel" x="106" y="4" width="28" height="26" rx="7"/>
        <rect class="pv-panel" x="106" y="90" width="28" height="26" rx="7"/>
        <path class="pv-line pv-line--accent" d="M38 60h14M188 60h14M114 17h12M114 103h12"/>
        <circle class="pv-ring" cx="120" cy="60" r="20"/>
        <path class="pv-accent2" d="M120 49l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/>
      </svg>`,
    layout: `
      <svg viewBox="0 0 240 120" aria-hidden="true" focusable="false">
        <rect class="pv-panel" x="46" y="10" width="148" height="100" rx="8"/>
        <path class="pv-line" d="M46 26h148" style="stroke-width:1.5"/>
        <circle class="pv-dot--muted" cx="57" cy="18" r="2.5"/>
        <circle class="pv-dot--muted" cx="66" cy="18" r="2.5"/>
        <circle class="pv-dot--muted" cx="75" cy="18" r="2.5"/>
        <rect class="pv-block pv-block--accent" x="58" y="38" width="58" height="8" rx="4"/>
        <rect class="pv-block" x="58" y="52" width="44" height="6" rx="3"/>
        <rect class="pv-block" x="58" y="63" width="36" height="6" rx="3"/>
        <rect class="pv-block--soft" x="130" y="36" width="52" height="36" rx="6"/>
        <rect class="pv-block" x="58" y="82" width="36" height="16" rx="4"/>
        <rect class="pv-block" x="100" y="82" width="36" height="16" rx="4"/>
        <rect class="pv-block" x="142" y="82" width="40" height="16" rx="4"/>
      </svg>`,
  };

  /* =========================================================================
     3. THEME TOGGLE
     ========================================================================= */

  const THEME_STORAGE_KEY = 'theme';
  const DEFAULT_THEME = 'dark';
  /** Browser toolbar colour for each theme (matches --color-bg in style.css). */
  const BROWSER_BAR_COLORS = { dark: '#0a0f1d', light: '#f6f7fb' };

  function readSavedTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (storageError) {
      return null; // storage can be blocked (private mode, strict settings)
    }
  }

  function saveTheme(themeName) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (storageError) {
      /* ignore: the theme still changes for this visit */
    }
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);

    const themeToggleButton = findElement('#theme-toggle');
    if (themeToggleButton) {
      const nextThemeName = themeName === 'dark' ? 'light' : 'dark';
      themeToggleButton.setAttribute('aria-label', `Switch to ${nextThemeName} theme`);
      themeToggleButton.setAttribute('title', `Switch to ${nextThemeName} theme`);
    }

    const themeColorMetaTag = findElement('meta[name="theme-color"]');
    if (themeColorMetaTag) themeColorMetaTag.setAttribute('content', BROWSER_BAR_COLORS[themeName]);
  }

  function initThemeToggle() {
    const savedTheme = readSavedTheme();
    const isValidSavedTheme = savedTheme === 'light' || savedTheme === 'dark';
    applyTheme(isValidSavedTheme ? savedTheme : DEFAULT_THEME);

    const themeToggleButton = findElement('#theme-toggle');
    if (!themeToggleButton) return;

    themeToggleButton.addEventListener('click', () => {
      const newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      saveTheme(newTheme);
    });
  }

  /* =========================================================================
     4. NAVIGATION
     ========================================================================= */

  function initMobileMenu() {
    const menuToggleButton = findElement('#nav-toggle');
    const navigationMenu = findElement('#nav-menu');
    if (!menuToggleButton || !navigationMenu) return;

    const isMenuOpen = () => menuToggleButton.getAttribute('aria-expanded') === 'true';

    const setMenuOpen = (shouldOpen) => {
      menuToggleButton.setAttribute('aria-expanded', String(shouldOpen));
      menuToggleButton.setAttribute('aria-label', shouldOpen ? 'Close menu' : 'Open menu');
      navigationMenu.classList.toggle('is-open', shouldOpen);
    };

    menuToggleButton.addEventListener('click', () => setMenuOpen(!isMenuOpen()));

    // Close after choosing a link.
    navigationMenu.addEventListener('click', (clickEvent) => {
      if (clickEvent.target.closest('a')) setMenuOpen(false);
    });

    // Close with Escape and return focus to the menu button.
    document.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        menuToggleButton.focus();
      }
    });

    // Close when tapping anywhere outside the navigation.
    document.addEventListener('click', (clickEvent) => {
      if (isMenuOpen() && !clickEvent.target.closest('.nav')) setMenuOpen(false);
    });

    // Reset when the window grows into the desktop layout.
    watchMediaQuery('(min-width: 1024px)', (mediaQueryEvent) => {
      if (mediaQueryEvent.matches) setMenuOpen(false);
    });
  }

  function initActiveNavLink() {
    const navigationLinks = findAllElements('.nav__link[href^="#"]');
    const linkForSection = new Map();

    navigationLinks.forEach((navigationLink) => {
      const sectionId = navigationLink.getAttribute('href').slice(1);
      const targetSection = document.getElementById(sectionId);
      if (targetSection) linkForSection.set(targetSection, navigationLink);
    });

    const markLinkActive = (activeLink) => {
      navigationLinks.forEach((navigationLink) => {
        const isActive = navigationLink === activeLink;
        navigationLink.classList.toggle('is-active', isActive);
        if (isActive) navigationLink.setAttribute('aria-current', 'true');
        else navigationLink.removeAttribute('aria-current');
      });
    };

    if ('IntersectionObserver' in window && linkForSection.size) {
      // A thin band across the middle of the screen decides which section is "current".
      const sectionObserver = new IntersectionObserver(
        (observedSections) => {
          observedSections.forEach((observedSection) => {
            if (observedSection.isIntersecting) {
              markLinkActive(linkForSection.get(observedSection.target));
            }
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      linkForSection.forEach((navigationLink, section) => sectionObserver.observe(section));
    }

    const lastNavigationLink = navigationLinks[navigationLinks.length - 1];

    return {
      // At the very bottom of the page the last section may never reach the middle band.
      checkPageBottom() {
        const pageBottomPosition = document.documentElement.scrollHeight - 4;
        const isAtPageBottom = window.innerHeight + window.scrollY >= pageBottomPosition;
        if (isAtPageBottom && lastNavigationLink) markLinkActive(lastNavigationLink);
      },
    };
  }

  /* =========================================================================
     5. REVEAL ON SCROLL
     ========================================================================= */

  function initRevealOnScroll() {
    const revealElements = findAllElements('.reveal');
    if (!revealElements.length) return;

    if (userPrefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealElements.forEach((revealElement) => revealElement.classList.add('is-visible'));
      return;
    }

    // Only now do elements start hidden (see .reveal-ready in style.css).
    document.documentElement.classList.add('reveal-ready');

    const revealObserver = new IntersectionObserver(
      (observedElements, observer) => {
        observedElements.forEach((observedElement) => {
          if (!observedElement.isIntersecting) return;
          observedElement.target.classList.add('is-visible');
          observer.unobserve(observedElement.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    );

    revealElements.forEach((revealElement) => revealObserver.observe(revealElement));
  }

  /* =========================================================================
     6. SCROLL STATE: header border, back-to-top button, bottom-of-page nav
     ========================================================================= */

  function initScrollEffects(activeNavLink) {
    const siteHeader = findElement('#site-header');
    const backToTopButton = findElement('#back-to-top');
    let isUpdateScheduled = false;

    const updateScrollEffects = () => {
      const scrollPosition = window.scrollY;
      const backToTopThreshold = window.innerHeight * 0.8;

      if (siteHeader) siteHeader.classList.toggle('is-scrolled', scrollPosition > 8);
      if (backToTopButton) {
        backToTopButton.classList.toggle('is-visible', scrollPosition > backToTopThreshold);
      }
      if (activeNavLink) activeNavLink.checkPageBottom();

      isUpdateScheduled = false;
    };

    // requestAnimationFrame keeps this to at most one update per screen frame.
    window.addEventListener(
      'scroll',
      () => {
        if (isUpdateScheduled) return;
        isUpdateScheduled = true;
        window.requestAnimationFrame(updateScrollEffects);
      },
      { passive: true }
    );

    updateScrollEffects();
  }

  /* =========================================================================
     7. PROJECTS
     ========================================================================= */

  function createLinkButton({ href, label, accessibleLabel, iconName, buttonStyle }) {
    const linkButton = createElementWith('a', `btn btn--sm btn--${buttonStyle}`);
    linkButton.href = href;
    linkButton.target = '_blank';
    linkButton.rel = 'noopener noreferrer';
    linkButton.setAttribute('aria-label', `${accessibleLabel} (opens in a new tab)`);
    linkButton.innerHTML = ICON_MARKUP[iconName]; // static icon markup only
    linkButton.append(document.createTextNode(label));
    return linkButton;
  }

  function createProjectActions(project) {
    const actionsContainer = createElementWith('div', 'project-card__actions');

    if (isWebAddress(project.repoUrl)) {
      actionsContainer.append(
        createLinkButton({
          href: project.repoUrl,
          label: 'View code',
          accessibleLabel: `View the ${project.title} code on GitHub`,
          iconName: 'github',
          buttonStyle: 'ghost',
        })
      );
    }

    if (isWebAddress(project.demoUrl)) {
      actionsContainer.append(
        createLinkButton({
          href: project.demoUrl,
          label: 'Live demo',
          accessibleLabel: `Open the ${project.title} live demo`,
          iconName: 'external',
          buttonStyle: 'primary',
        })
      );
    }

    // No links yet: say so plainly instead of showing buttons that go nowhere.
    if (!actionsContainer.childElementCount) {
      const unavailableNote = createElementWith('p', 'link-unavailable');
      unavailableNote.innerHTML = ICON_MARKUP.clock;
      const noteText =
        project.status === 'planned'
          ? 'Not started yet. Code will be shared on GitHub.'
          : 'Repository not public yet.';
      unavailableNote.append(document.createTextNode(noteText));
      actionsContainer.append(unavailableNote);
    }

    return actionsContainer;
  }

  function createProjectCard(project) {
    const projectStatus = STATUS_LABELS[project.status] ? project.status : 'planned';
    const projectCategories = (project.categories || []).filter(
      (categoryKey) => CATEGORY_LABELS[categoryKey]
    );
    const illustrationName = PROJECT_ILLUSTRATIONS[project.visual] ? project.visual : 'layout';

    const projectCard = createElementWith('article', 'project-card reveal');
    projectCard.dataset.categories = projectCategories.join(' ');

    const illustration = createElementWith(
      'div',
      `project-card__visual project-card__visual--${illustrationName}`
    );
    illustration.setAttribute('aria-hidden', 'true');
    illustration.innerHTML = PROJECT_ILLUSTRATIONS[illustrationName]; // static, author-defined SVG

    const cardBody = createElementWith('div', 'project-card__body');

    const cardMeta = createElementWith('div', 'project-card__meta');
    const statusBadge = createElementWith('span', `status status--${projectStatus}`);
    statusBadge.append(
      createElementWith('span', 'visually-hidden', 'Status: '),
      document.createTextNode(STATUS_LABELS[projectStatus])
    );
    const categoryLabel = createElementWith(
      'span',
      'project-card__category',
      projectCategories.map((categoryKey) => CATEGORY_LABELS[categoryKey]).join(' · ')
    );
    cardMeta.append(statusBadge, categoryLabel);

    const cardTitle = createElementWith('h3', 'project-card__title', project.title);
    const cardDescription = createElementWith('p', 'project-card__desc', project.description);

    const technologyList = createElementWith('ul', 'tag-list');
    technologyList.setAttribute('aria-label', `Technologies for ${project.title}`);
    (project.tags || []).forEach((technologyName) => {
      technologyList.append(createElementWith('li', 'tag', technologyName));
    });

    cardBody.append(cardMeta, cardTitle, cardDescription, technologyList, createProjectActions(project));
    projectCard.append(illustration, cardBody);
    return projectCard;
  }

  function renderProjectCards() {
    const projectGrid = findElement('#project-grid');
    if (!projectGrid) return;

    const cardsFragment = document.createDocumentFragment();
    PROJECTS.forEach((project) => cardsFragment.append(createProjectCard(project)));

    if (!PROJECTS.length) {
      cardsFragment.append(
        createElementWith('p', 'projects__empty', 'Projects are on the way. Check back soon.')
      );
    }

    projectGrid.replaceChildren(cardsFragment); // also removes the <noscript> fallback
  }

  function initProjectFilters() {
    const filterButtonGroup = findElement('#project-filters');
    const projectGrid = findElement('#project-grid');
    const resultCountText = findElement('#project-count');
    if (!filterButtonGroup || !projectGrid) return;

    const projectCards = findAllElements('.project-card', projectGrid);
    const filterButtons = findAllElements('.filter-btn', filterButtonGroup);
    if (!projectCards.length) return;

    const cardMatchesFilter = (projectCard, filterName) =>
      filterName === 'all' || projectCard.dataset.categories.split(' ').includes(filterName);

    // Show how many projects each filter contains, e.g. "AI Engineering 3".
    filterButtons.forEach((filterButton) => {
      const matchingCardCount = projectCards.filter((projectCard) =>
        cardMatchesFilter(projectCard, filterButton.dataset.filter)
      ).length;
      const countBadge = createElementWith('span', 'filter-btn__count', String(matchingCardCount));
      countBadge.setAttribute('aria-hidden', 'true');
      filterButton.append(countBadge);
    });

    let emptyCategoryMessage = null;

    const applyFilter = (selectedFilter) => {
      let visibleCardCount = 0;

      projectCards.forEach((projectCard) => {
        const shouldShowCard = cardMatchesFilter(projectCard, selectedFilter);
        projectCard.hidden = !shouldShowCard;
        if (shouldShowCard) visibleCardCount += 1;
      });

      filterButtons.forEach((filterButton) => {
        const isSelected = filterButton.dataset.filter === selectedFilter;
        filterButton.setAttribute('aria-pressed', String(isSelected));
      });

      if (resultCountText) {
        const projectWord = projectCards.length === 1 ? 'project' : 'projects';
        resultCountText.textContent = `Showing ${visibleCardCount} of ${projectCards.length} ${projectWord}`;
      }

      if (!visibleCardCount && !emptyCategoryMessage) {
        emptyCategoryMessage = createElementWith(
          'p',
          'projects__empty',
          'No projects in this category yet.'
        );
        projectGrid.append(emptyCategoryMessage);
      } else if (visibleCardCount && emptyCategoryMessage) {
        emptyCategoryMessage.remove();
        emptyCategoryMessage = null;
      }
    };

    filterButtonGroup.addEventListener('click', (clickEvent) => {
      const clickedFilterButton = clickEvent.target.closest('.filter-btn');
      if (clickedFilterButton) applyFilter(clickedFilterButton.dataset.filter);
    });

    filterButtonGroup.hidden = false;
    applyFilter('all');
  }

  /* =========================================================================
     8. SOCIAL LINKS
     Placeholders in the HTML are plain text (not links). When a value is added
     to SOCIAL_LINKS, each placeholder is swapped for a real, working link.
     ========================================================================= */

  function buildSocialHref(platformName, profileValue) {
    if (platformName === 'email') {
      return EMAIL_PATTERN.test(profileValue || '') ? `mailto:${profileValue}` : '';
    }
    return isWebAddress(profileValue) ? profileValue.trim() : '';
  }

  function buildSocialDisplayText(platformName, profileValue) {
    if (platformName === 'email') return profileValue;
    return profileValue.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  }

  function activateSocialLinks() {
    findAllElements('[data-social]').forEach((placeholderElement) => {
      const platformName = placeholderElement.dataset.social;
      const profileValue = SOCIAL_LINKS[platformName];
      const linkHref = buildSocialHref(platformName, profileValue);
      if (!linkHref) return; // keep the honest placeholder

      const socialLink = document.createElement('a');
      placeholderElement.classList.forEach((className) => {
        if (!className.endsWith('--placeholder')) socialLink.classList.add(className);
      });
      socialLink.href = linkHref;
      if (platformName !== 'email') {
        socialLink.target = '_blank';
        socialLink.rel = 'noopener noreferrer';
      }

      socialLink.append(...placeholderElement.childNodes);
      findAllElements('[data-placeholder-note]', socialLink).forEach((placeholderNote) =>
        placeholderNote.remove()
      );

      const displayedValue = findElement('[data-social-value]', socialLink);
      if (displayedValue) {
        displayedValue.textContent = buildSocialDisplayText(platformName, profileValue);
      }

      placeholderElement.replaceWith(socialLink);
    });
  }

  /* =========================================================================
     9. CONTACT FORM
     Demo mode (default): validates input, sends nothing, and says so.
     Live mode: set data-endpoint on the <form> to a form-service URL
     (e.g. Formspree) and messages are POSTed there.
     ========================================================================= */

  /** Each rule returns an error message, or '' when the value is valid. */
  const FORM_FIELD_RULES = {
    name(fieldValue) {
      return fieldValue.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).';
    },
    email(fieldValue) {
      if (!fieldValue.trim()) return 'Please enter your email address.';
      return EMAIL_PATTERN.test(fieldValue.trim())
        ? ''
        : 'Please enter a valid email address, like name@example.com.';
    },
    message(fieldValue) {
      const messageLength = fieldValue.trim().length;
      if (messageLength < 10) return 'Please write a message of at least 10 characters.';
      if (messageLength > 2000) return 'Please keep your message under 2,000 characters.';
      return '';
    },
  };

  function initContactForm() {
    const contactForm = findElement('#contact-form');
    if (!contactForm) return;

    const formEndpoint = (contactForm.dataset.endpoint || '').trim();
    const isConnectedToService = isWebAddress(formEndpoint);
    const submitButton = findElement('[type="submit"]', contactForm);
    const formStatusMessage = findElement('#form-status');
    const demoNotice = findElement('#form-notice');
    const validatedFields = Object.keys(FORM_FIELD_RULES)
      .map((fieldName) => contactForm.elements[fieldName])
      .filter(Boolean);

    if (submitButton) submitButton.disabled = false;
    if (isConnectedToService && demoNotice) demoNotice.hidden = true;

    let hasTriedToSubmit = false;

    const showFormStatus = (statusType, statusText) => {
      if (!formStatusMessage) return;
      formStatusMessage.className = `form-status form-status--${statusType}`;
      formStatusMessage.textContent = statusText;
    };

    const validateField = (formField) => {
      const errorText = FORM_FIELD_RULES[formField.name](formField.value);
      const errorElement = document.getElementById(`${formField.id}-error`);
      formField.setAttribute('aria-invalid', errorText ? 'true' : 'false');
      if (errorElement) errorElement.textContent = errorText;
      return !errorText;
    };

    validatedFields.forEach((formField) => {
      // Give live feedback only after the first submit attempt or an existing error.
      formField.addEventListener('input', () => {
        const alreadyHasError = formField.getAttribute('aria-invalid') === 'true';
        if (hasTriedToSubmit || alreadyHasError) validateField(formField);
      });
      formField.addEventListener('blur', () => {
        if (formField.value.trim()) validateField(formField);
      });
    });

    contactForm.addEventListener('submit', async (submitEvent) => {
      submitEvent.preventDefault();
      hasTriedToSubmit = true;

      const invalidFields = validatedFields.filter((formField) => !validateField(formField));
      if (invalidFields.length) {
        showFormStatus('error', 'Please fix the highlighted fields and try again.');
        invalidFields[0].focus();
        return;
      }

      // Bots tend to fill the hidden spam-trap field; quietly ignore those submissions.
      const spamTrapField = contactForm.elements._gotcha;
      if (spamTrapField && spamTrapField.value) return;

      if (!isConnectedToService) {
        showFormStatus(
          'info',
          'Thanks! Your message looks good, but this is a demo form so nothing was sent. Please reach me on GitHub for now.'
        );
        return;
      }

      const originalButtonText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
      }

      try {
        const serverResponse = await fetch(formEndpoint, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (!serverResponse.ok) {
          throw new Error(`Request failed with status ${serverResponse.status}`);
        }

        contactForm.reset();
        validatedFields.forEach((formField) => formField.removeAttribute('aria-invalid'));
        hasTriedToSubmit = false;
        showFormStatus('success', 'Thank you! Your message has been sent.');
      } catch (sendError) {
        console.error(sendError);
        showFormStatus(
          'error',
          'Sorry, your message could not be sent. Please try again later or reach out on GitHub.'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  /* =========================================================================
     10. FOOTER YEAR
     ========================================================================= */

  function showCurrentYear() {
    const yearElement = findElement('#year');
    if (yearElement) yearElement.textContent = String(new Date().getFullYear());
  }

  /* =========================================================================
     11. START-UP
     Each feature runs independently, so one failure can't break the rest.
     ========================================================================= */

  function runFeatureSafely(featureName, featureSetup) {
    try {
      return featureSetup();
    } catch (setupError) {
      console.error(`[portfolio] ${featureName} failed:`, setupError);
      return undefined;
    }
  }

  function initPortfolio() {
    runFeatureSafely('theme toggle', initThemeToggle);
    runFeatureSafely('mobile menu', initMobileMenu);
    runFeatureSafely('project cards', renderProjectCards);
    runFeatureSafely('project filters', initProjectFilters);
    runFeatureSafely('social links', activateSocialLinks);
    runFeatureSafely('contact form', initContactForm);
    runFeatureSafely('footer year', showCurrentYear);
    const activeNavLink = runFeatureSafely('active nav link', initActiveNavLink);
    runFeatureSafely('scroll effects', () => initScrollEffects(activeNavLink));
    // Runs last so the generated project cards are included.
    runFeatureSafely('reveal on scroll', initRevealOnScroll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
})();
