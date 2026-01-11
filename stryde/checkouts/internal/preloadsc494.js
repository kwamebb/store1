
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills-legacy.CtQNjSfa.js","/cdn/shopifycloud/checkout-web/assets/c1/app-legacy.BYgVJ76v.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en-legacy.D8g6ioNP.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage-legacy.B2FinzVA.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField-legacy.D0ZMHdKO.js","/cdn/shopifycloud/checkout-web/assets/c1/RememberMeDescriptionText-legacy.CCncB0aO.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer-legacy.CChKVcBt.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentButtons-legacy.B2hKIVq2.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblemsLineItemList-legacy.CWRuNUmk.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalPickup-legacy.DOuASROX.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayButtonClassName-legacy.DeN8U90c.js","/cdn/shopifycloud/checkout-web/assets/c1/VaultedPayment-legacy.CGyfK_k8.js","/cdn/shopifycloud/checkout-web/assets/c1/SeparatePaymentsNotice-legacy.B2q9HBXz.js","/cdn/shopifycloud/checkout-web/assets/c1/useAddressManager-legacy.DIaLjY9Z.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayPaymentRequiredMethod-legacy.Clhp8tKE.js","/cdn/shopifycloud/checkout-web/assets/c1/PayButtonSection-legacy.rnvXmieg.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown-legacy.iF7mKLRh.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal-legacy.B1td5xgE.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview-legacy.B2f21ICg.js","/cdn/shopifycloud/checkout-web/assets/c1/component-ShopPayVerificationSwitch-legacy.CYkb2xW0.js","/cdn/shopifycloud/checkout-web/assets/c1/useSubscribeMessenger-legacy.2uYkWns3.js","/cdn/shopifycloud/checkout-web/assets/c1/index-legacy.BGLw5PVc.js","/cdn/shopifycloud/checkout-web/assets/c1/component-RuntimeExtension-legacy.DMBTl1kr.js","/cdn/shopifycloud/checkout-web/assets/c1/controller-legacy.CxgWWGj6.js"];
      var styles = [];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0960/1318/9463/files/Kopie_van_Kopie_van_Kopie_van_Logo_Nancy_Jewelry_x320.png?v=1762333077"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  