
// 初始化所有功能
initializeApp();

// 立即執行圖片預載入（在DOM解析之前）
document.addEventListener('DOMContentLoaded', function() {
  forcePreloadImages();
});

// 影片載入處理
function handleVideoLoading() {
  const video = document.getElementById('kvVideo');
  const placeholder = document.getElementById('kvPlaceholder');
  
  if (!video || !placeholder) return;
  
  // 設定影片載入事件
  video.addEventListener('loadeddata', function() {
    // 影片可以播放時
    video.classList.add('loaded');
    placeholder.classList.add('hidden');
    
    // 延遲移除占位元素以確保平滑過渡
    setTimeout(() => {
      placeholder.style.display = 'none';
    }, 500);
  });
  
  // 如果影片載入失敗，保持占位圖片顯示
  video.addEventListener('error', function() {
    console.warn('影片載入失敗，顯示占位圖片');
    // 隱藏載入動畫但保持占位圖片
    const spinner = placeholder.querySelector('.loading-spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  });
  
  // 檢查影片是否已經載入完成（處理快取情況）
  if (video.readyState >= 3) {
    video.classList.add('loaded');
    placeholder.classList.add('hidden');
    setTimeout(() => {
      placeholder.style.display = 'none';
    }, 500);
  }
}

// 強制預載入關鍵圖片
function forcePreloadImages() {
  const criticalImages = [
    'images/dec-cl-sub.svg',
    'images/dec-cl-mj.svg', 
    'images/deco_circle.png',
    'images/bg.svg',
    'images/fixed_btn.png'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
    // 強制載入
    img.onload = function() {
      console.log(`圖片已載入: ${src}`);
    };
    img.onerror = function() {
      console.warn(`圖片載入失敗: ${src}`);
    };
  });
}

function initializeApp() {
  'use strict';
  
  // 立即開始預載入關鍵圖片
  forcePreloadImages();
  
  $(function () {
    // 初始化影片載入處理
    handleVideoLoading();
    
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

