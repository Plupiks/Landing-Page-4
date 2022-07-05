import { scrollIntoView } from './vendors/seamless-scroll-polyfill/scrollIntoView.js'; // Для коректної роботи скролу в Safari
import { Fancybox } from './vendors/@fancyapps/fancybox.esm.js'; // Бібліотека галереї
import { CountUp } from './vendors/countup.js/countUp.min.js'; // Бібліотека галереї

// Menu
function menu() {
  // PC header
  const menuBG = document.querySelector('.header');
  const menuBody = document.querySelector('.header__body');

  // Navigation
  const linksBody = document.querySelector('.nav__links');
  const links = document.querySelectorAll('.nav__link');

  // WhiteSpace
  const whiteSpace = document.querySelector('.white-space');

  // Mobile header
  const checkbox = document.querySelector('.checkbox');
  const mobileMenuBody = document.querySelector('.burger-menu__content');
  const mobileMenuButton = document.querySelector('.burger-menu__button');

  // Backdrop (for mobile)
  const backdrop = document.querySelector('.backdrop');

  // For color change
  const logo = document.querySelector('.header__logo');
  const logoText = document.querySelector('.logo__text');
  const link = document.querySelectorAll('a.link__items');
  const burgerMenuLines = document.querySelectorAll('.burger-menu__line');
  let backgroundColor;
  let textColor;
  let burgerMenuLineColor;

  // Зміна кольору шапки при скролі
  function changeColorOnscroll() {
    $(window).on('load scroll resize click', () => {
      if ($(checkbox).prop('checked') === false) {
        backgroundColor = scrollY > menuBG.clientHeight ? $(':root').css('--headerBGScrolled') : $(':root').css('--headerBG');
        textColor = scrollY > menuBG.clientHeight ? $(':root').css('--headerTextScrolledColor') : $(':root').css('--headerTextColor');
        burgerMenuLineColor = scrollY > menuBG.clientHeight ? $(':root').css('--burgerMenuLinesActive') : $(':root').css('--burgerMenuLines');
      } else {
        backgroundColor = 'transparent';
        textColor = $(':root').css('--headerTextColor');
        burgerMenuLineColor = $(':root').css('--burgerMenuLinesActive');
      }

      menuBG.style.background = backgroundColor;
      logoText.style.color = textColor;
      link.forEach((link) => (link.style.color = textColor));
      burgerMenuLines.forEach((line) => (line.style.background = burgerMenuLineColor));
    });
  }
  changeColorOnscroll();

  // Додав пустоту щоб вирівняти навігацію посередині
  function addWhiteSpace() {
    $(window).on('load resize', () => {
      whiteSpace.style.width = logo.clientWidth + 'px';
    });
  }
  addWhiteSpace();

  // Переміщаю навігацію до бургер меню
  function moveLinksToOtherBlock() {
    $(window).on('resize load', () => {
      if (window.matchMedia('(max-width:992px').matches) {
        $(linksBody).prependTo($(mobileMenuBody));
      } else {
        $(linksBody).appendTo($(menuBody));
        $(whiteSpace).appendTo($(menuBody));
      }
    });
  }
  moveLinksToOtherBlock();

  // Відкриваю меню при нажимані
  function showMenuMobile() {
    // Анімація відкриття для меню
    function slideRight() {
      // Ширина від 992px до 376px
      if ($(window).width() <= 992 && $(window).width() > 400) {
        if ($(checkbox).prop('checked') === false) {
          $(mobileMenuBody).css('transform', 'translateX(0px)');
          $(backdrop).addClass('backdrop-active');
          $(menuBG).css('background', 'none');
        } else {
          $(mobileMenuBody).css('transform', 'translateX(-300px)');
          $(backdrop).removeClass('backdrop-active');
          $(menuBG).css('background', backgroundColor);
        }
      }

      // Ширина від 376px до 0px
      else if ($(window).width() <= 400) {
        if ($(checkbox).prop('checked') === false) {
          $(mobileMenuBody).css('transform', 'translateX(0px)');
          $(backdrop).addClass('backdrop-active');
          $(menuBG).css('background', 'none');
        } else {
          $(mobileMenuBody).css('transform', 'translateX(-395px)');
          $(backdrop).removeClass('backdrop-active');
          $(menuBG).css('background', backgroundColor);
        }
      }

      // Ширина від 992px і вище
      else {
        $(backdrop).removeClass('backdrop-active');
        $(menuBG).css('background', backgroundColor);
      }
    }

    // Ховаю меню при ресайзі
    function closeMenuHover() {
      $(window).on('resize', function () {
        $(checkbox).prop('checked', false);

        // Ширина від 992px до 376px
        if ($(window).width() <= 992 && $(window).width() > 400) {
          $(mobileMenuBody).css('transform', 'translateX(-300px)');
          $(backdrop).removeClass('backdrop-active');
          $(menuBG).css('background', backgroundColor);
        }

        // Ширина від 376px до 0px
        else if ($(window).width() < 400) {
          $(mobileMenuBody).css('transform', 'translateX(-395px)');
          $(backdrop).removeClass('backdrop-active');
          $(menuBG).css('background', backgroundColor);
        }

        // Ширина від 992px і вище
        else {
          $(mobileMenuBody).css('transform', 'translateX(0px)');
          $(backdrop).removeClass('backdrop-active');
          $(menuBG).css('background', backgroundColor);
        }
      });
    }
    closeMenuHover();

    // Показую меню при нажиманні на кнопку
    mobileMenuButton.addEventListener('click', function () {
      slideRight();
      $(checkbox).prop('checked', !$(checkbox).prop('checked'));
    });

    // Ховаю меню при нажиманні на силку
    $(window).on('load resize', () => {
      if ($(window).width() < 992) {
        links.forEach(function (link, i) {
          link.addEventListener('click', function () {
            slideRight();
            $(checkbox).prop('checked', !$(checkbox).prop('checked'));
          });
        });
      }
    });

    backdrop.addEventListener('click', function () {
      slideRight();
      $(checkbox).prop('checked', !$(checkbox).prop('checked'));
    });
  }
  showMenuMobile();
}
menu();

// Set padding top equal header height
function heroPaddingTop() {
  const headerHeight = document.querySelector('.header').clientHeight;
  const hero = document.querySelector('.hero');

  $(window).on('load resize', () => {
    hero.style.paddingTop = headerHeight + 'px';
  });
}
heroPaddingTop();

// use preventDefault on buttons
function offButtonDefaults() {
  const buttons = document.querySelectorAll('.section-button');

  buttons.forEach((button) => {
    button.addEventListener('click', (el) => el.preventDefault());
  });
}
offButtonDefaults();

// Include Fancybox library
function fancybox() {
  Fancybox.bind('[data-fancybox="video"]', {
    hideScrollbar: false,
  });
}
fancybox();

function progress(progressTitle, progressBarBody, progressFillBar, progressPercent) {
  // CountUp options
  const options = {
    easingFn: function (t, b, c, d) {
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    },
    suffix: '%',
    duration: 2,
    scrollSpyOnce: true,
  };
  // CountUp init
  const countup = new CountUp(progressPercent, progressPercent.dataset.percent, options);

  // Активую анімацію заповнення при скролі
  $(window).on('load scroll resize', function () {
    const scrollOffset = $(window).scrollTop();
    // the distance from the beginning of the page to the moment when the element will be in the field of view
    const elementOffsetTop = $(progressFillBar).offset().top - 930;

    // Show an animation when an element comes into view
    if (scrollOffset > elementOffsetTop) {
      progressFillBar.style.width = progressPercent.dataset.percent + '%';
      countup.start();

      const minPercent = Math.ceil((progressTitle.clientWidth * 100) / progressBarBody.clientWidth) + 3; // min percent value
      // hiding the percentage text in case - if the progress text is larger than the percentage text
      if (parseInt(progressFillBar.style.width) > minPercent) {
        progressPercent.classList.add('progress-bar__percent_animation'); // show percentage text
      } else {
        progressPercent.classList.remove('progress-bar__percent_animation'); // hide percentage text
      }
    }
  });
}

// Progress init
const progressTitle = Array.from(document.querySelectorAll('.progress__title'));
const percent = Array.from(document.querySelectorAll('.progress-bar__percent'));
const progressBody = document.querySelector('.progress__bar');
const progressFillBar = Array.from(document.querySelectorAll('.progress-bar__fill'));

for (let i = 0; i < progressTitle.length; i++) {
  progress(progressTitle[i], progressBody, progressFillBar[i], percent[i]);
}

// Accordion
function accordion(accordion, accordionHeader, accordionBody) {
  $(document).mouseup(function (e) {
    /* If clicked not on accordion or it's child */
    if (!$(accordion).is(e.target) && $(accordion).has(e.target).length === 0) {
      accordion.classList.remove('accordion_active'); // Remove active class
      accordionBody.style.maxHeight = 0; // slideUp accordion body
    } else {
      /* If clicked  on accordion or it's child */
      if ($(accordionHeader).is(e.target) || $(accordionHeader).children().is(e.target)) {
        accordion.classList.toggle('accordion_active');
        accordionBody.style.maxHeight = $(accordion).hasClass('accordion_active')
          ? accordionBody.scrollHeight + 'px'
          : (accordionBody.style.maxHeight = 0);
      }
    }
  });
}

const accordionElem = document.querySelectorAll('.accordion');
const accordionHeader = document.querySelectorAll('.accordion-header');
const accordionBody = document.querySelectorAll('.accordion-body');

for (let i = 0; i < accordionElem.length; i++) {
  accordion(accordionElem[i], accordionHeader[i], accordionBody[i]);
}

// Scroll to sections
function scrollToSection() {
  const anchors = document.querySelectorAll('a[href^="#s-"]');

  for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const blockID = anchor.getAttribute('href'); // Отримую силки з назвами блоків до яких буду скролити

      $('html,body').animate({ scrollTop: $('' + blockID).offset().top - 40 + 'px' }, 500);
    });
  }
}
scrollToSection();

// Scroll to hero section
function scrolToHero() {
  const headerLink = document.querySelector('.header__logo');
  headerLink.addEventListener('click', (e) => {
    e.preventDefault;
    scrollIntoView(document.querySelector('#s-hero'), {
      behavior: 'smooth',
      block: 'start',
    });
  });
}
scrolToHero();

// Scroll to hero section (footer)
const headerLink2 = document.querySelector('.footer__logo');
headerLink2.addEventListener('click', (e) => {
  e.preventDefault;
  scrollIntoView(document.querySelector('#s-hero'), {
    behavior: 'smooth',
    block: 'start',
  });
});

// // Активний клас для меню при скролі
function activeClassMenu() {
  const menuLinks = document.querySelectorAll('.link a[href^="#s-"]');
  const sections = document.querySelectorAll('section');
  $(window).on('scroll load', () => {
    const scrollTop = scrollY;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollTop + 500) {
        menuLinks.forEach((link) => {
          if (link.getAttribute('href').replace('#', '') === section.getAttribute('id')) {
            link.classList.add('link-active');
          } else {
            link.classList.remove('link-active');
          }
        });
      }
    });
  });
}
activeClassMenu();

AOS.init({
  // Global settings:
  once: true,
  duration: 1000,
  delay: 100,
  anchorPlacement: 'top',
});
