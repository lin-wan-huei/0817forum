/*--------------------------------

使用方式：
<!-- 觸發按鈕 -->
<button data-popup-trigger="popUp_1">產品詳情</button>
<button data-popup-trigger="popUp_cart1">購物車</button>
<button data-popup-trigger="popUp_login">登入</button>
<!-- 對應彈窗 -->
<div id="popUp_1" class="popUpWrap"><div class="popUpWrap__inner">產品內容<span class="close">X</span></div></div>
<div id="popUp_cart1" class="popUpWrap"><div class="popUpWrap__inner">購物車內容<span class="close">X</span></div></div>
<div id="popUp_login" class="popUpWrap"><div class="popUpWrap__inner">登入表單<span class="close">X</span></div></div>

--------------------------------*/

$(document).ready(function () {
    'use strict';

    /**
     * 通用彈窗系統 - 使用 data 屬性版本
     * 支援格式：data-popup-trigger="popUp_xx" 觸發 #popUp_xx
     * 符合源碼檢測、弱掃、滲透測試標準
     */

    // 定義彈窗相關的 CSS 選擇器
    var POPUP_SELECTORS = {
        containers: '.popUpWrap', // 支援多種類別名稱
        popups: '[id^="popUp_"]', // 支援多種類別名稱
        triggers: '[data-popup-trigger^="popUp_"]', // 使用 data 屬性觸發
        closeButtons: '.close, [data-close]'
    };

    // 遮罩元素會在初始化時添加，這裡不需要重複添加

    // 彈窗觸發器點擊事件處理
    $(document).on('click', POPUP_SELECTORS.triggers, function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('觸發器被點擊:', $(this).attr('data-popup-trigger')); // 調試輸出

        try {
            // 安全獲取觸發器的 data-popup-trigger 值
            var triggerValue = $(this).attr('data-popup-trigger');

            // 基本驗證
            if (!triggerValue || typeof triggerValue !== 'string' || triggerValue.length === 0) {
                console.error('PopUp System: 無效的觸發器值');
                return false;
            }

            // 嚴格驗證觸發器值格式：popUp_ + 允許的字符
            var validTriggerPattern = /^popUp_([a-zA-Z0-9_]+)$/;
            var matches = triggerValue.match(validTriggerPattern);

            if (!matches || matches.length < 2) {
                console.error('PopUp System: 觸發器值格式錯誤:', triggerValue);
                return false;
            }

            // 提取並驗證目標 ID
            var targetId = matches[1];

            // 驗證目標 ID 安全性（防止 XSS 和路徑穿越）
            if (!/^[a-zA-Z0-9_]+$/.test(targetId) || targetId.length > 50) {
                console.error('PopUp System: 目標 ID 包含非法字符或過長:', targetId);
                return false;
            }

            // 構建安全的彈窗選擇器
            var popupSelector = '#' + triggerValue;
            var $targetPopup = $(popupSelector);

            // 驗證目標彈窗是否存在
            if ($targetPopup.length === 0) {
                console.warn('PopUp System: 找不到對應的彈窗:', popupSelector);
                return false;
            }

            // 驗證目標元素是否為有效的彈窗
            if (!$targetPopup.hasClass('popUpWrap')) {
                console.error('PopUp System: 目標元素不是有效的彈窗:', popupSelector);
                return false;
            }

            // 安全地關閉所有現有彈窗
            $(POPUP_SELECTORS.containers).each(function () {
                if ($(this).is(':visible')) {
                    $(this).fadeOut(300);
                }
            });

            // 顯示目標彈窗
            $targetPopup.fadeIn(300).css('display', 'flex');

            // 為可訪問性添加焦點管理
            $targetPopup.attr('tabindex', '-1').focus();

            // 記錄操作（調試用，生產環境可移除）
            if (typeof console !== 'undefined' && console.log) {
                console.log('PopUp System: 顯示彈窗', popupSelector);
            }

        } catch (error) {
            console.error('PopUp System: 處理觸發事件時發生錯誤:', error);
            return false;
        }

        return false;
    });

    // 遮罩點擊關閉功能
    $(document).on('click', '.js-mask', function (e) {
        console.log('遮罩被點擊，關閉彈窗'); // 調試輸出
        $(this).closest('.popUpWrap').fadeOut(300);
    });

    // ESC 鍵關閉彈窗功能
    $(document).on('keydown', function (e) {
        if (e.keyCode === 27 || e.which === 27) { // ESC 鍵
            console.log('ESC 鍵被按下'); // 調試輸出
            var $visiblePopups = $('.popUpWrap:visible');
            if ($visiblePopups.length > 0) {
                console.log('關閉', $visiblePopups.length, '個可見彈窗'); // 調試輸出
                $visiblePopups.fadeOut(300);
            }
        }
    });

    // 防止彈窗內容點擊時關閉彈窗
    $(document).on('click', '.popUpWrap .popUp', function (e) {
        e.stopPropagation();
    });

    // 關閉按鈕點擊事件
    $(document).on('click', '.close, [data-close]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('關閉按鈕被點擊'); // 調試輸出

        // 直接找最近的 .popUpWrap 並關閉
        var $popup = $(this).closest('.popUpWrap');
        if ($popup.length > 0) {
            console.log('找到彈窗，準備關閉:', $popup.attr('id')); // 調試輸出
            $popup.fadeOut(300);
        } else {
            console.warn('找不到要關閉的彈窗');
        }
    });

    // 初始化時隱藏所有彈窗並確保遮罩存在
    $('.popUpWrap').each(function () {
        $(this).hide();
        if ($(this).find('.js-mask').length === 0) {
            $(this).append('<span class="js-mask"></span>');
        }
    });

    // console.log('彈窗系統已初始化，找到', $('.popUpWrap').length, '個彈窗'); // 調試輸出
});