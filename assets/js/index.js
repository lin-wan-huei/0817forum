
// 初始化所有功能
initializeApp();

function initializeApp() {
  'use strict';
  $(function () {
    // 漢堡選單功能
    $('.hamburger').on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('is-active');
      $('.mb_menu').toggleClass('visible');
    });

    // 手機選單連結點擊功能
    $('.mb_menu li a').on('click', function () {
      $('.mb_menu').toggleClass('visible');
      $('.hamburger').toggleClass('is-active');
    });

    // 預載器淡出效果
    setTimeout(function () {
      $('#preloader').fadeOut(3000);
    }, 4000);

    // 平滑滾動功能
    $('.menu li a[href^="#"], .smScroll').on('click', function (event) {
      var target = $(this.getAttribute('href'));
      if (target.length) {
        event.preventDefault();
        $('html, body')
          .stop()
          .animate({ scrollTop: target.offset().top - 59 }, 500);
      }
    });
  });
}

// 定義全域選擇器常數
const SELECTORS = {
  navbar: '.menubar', //<header>
  body: 'body'
};

// 快取常用的 jQuery 物件
const $window = $(window);
const $document = $(document);
const $body = $(SELECTORS.body);

$document.ready(function () {
  onResizeFunction();
  // $window.on('resize', onResizeFunction);
  $window.on('scroll', onScrollFunction);
});

function onResizeFunction() {
  // 處理視窗尺寸變更時的邏輯
  adjustHeaderHeight();
}

function onScrollFunction(e) {
  adjustHeaderHeight();
  handleMenubarBackground();
}

// 處理選單列背景顯示
function handleMenubarBackground() {
  if ($window.scrollTop() > 0) {
    $('.menubar .bg').addClass('bg_show');
  } else {
    $('.menubar .bg').removeClass('bg_show');
  }
}

//!====依header高度變動時自動調節高度
function adjustHeaderHeight() {
  var scrollTop = $window.scrollTop();
  var headerH = $('.menubar').innerHeight();

  if (scrollTop > 250) {
    //表頭fixed
    $(SELECTORS.navbar).addClass('menubar--fixed');
  } else {
    $(SELECTORS.navbar + '.menubar--fixed').removeClass('menubar--fixed');
  }

  $body.css({
    '--headerH': headerH + 'px',
  });
}

