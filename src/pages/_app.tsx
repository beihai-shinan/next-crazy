import '../styles/globals.css';
import '~/assets/fonts/iconfont.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Tracker from '../shared/track';
import Script from 'next/script';
import Head from 'next/head';
// import { appWithTranslation } from 'next-i18next';

import type { AppProps } from 'next/app';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* <link rel="stylesheet" href="/enki/styles/enki-common.css" /> */}
      </Head>
      <Script
        onLoad={() => {
          console.log('onLoad22');
        }}
        id="scriptAfterInteractive"
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js"
      />
      <Script
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('onLoad');
        }}
        dangerouslySetInnerHTML={{
          __html: `
        function getCookieInGtm(name) {
          var value = '; '+ document.cookie;
          var parts = value.split('; '+name+'=');
          if (parts.length === 2) return parts.pop().split(';').shift();
        }
        
        console.log('[hotjar-recording]2222')
        window.__hotjarInitCallback = function () {
          if (window.__isHotjarInitialized) {
            return
          }
  
          var hotjarStartDelay = 1000; // 8s
          var hotjarTrackPercentageLimit = 0.02; // 2%
          var recordingPercentage = Math.random();
  
          if (hotjarTrackPercentageLimit == 0) {
            // we don't want any recordings
            console.log('[hotjar-recording] SKIP HOTJAR RECORDING hotjarTrackPercentageLimit == 0')
            return
          }
  
          if (recordingPercentage > hotjarTrackPercentageLimit) {
            console.log('[hotjar-recording] SKIP HOTJAR RECORDING recordingPercentage > hotjarTrackPercentageLimit')
            return
          }
  
          console.log('[hotjar-recording] HOTJAR INITIALIZED!')
  
          setTimeout(function() {
            console.log('[hotjar-recording] HOTJAR STARTED!')
            try {
              if (window.__isHotjarInitialized) {
                return
              }
              //third cookie lib accepted
              var hasInitConsent = getCookieInGtm('OptanonConsent') // TODO: Check cookie and privacy options
              var hasIdentifyConsent = true // TODO: Check cookie and privacy options
  
              if (hasInitConsent) {
                window.__isHotjarInitialized = true;
  
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:3201338,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                        
                if (hasIdentifyConsent) {
                  var userId = getCookieInGtm('user_id'); // TODO: properly check
                  var userAttributes = { // TODO: add useful info.
                    test: true, 
                    need_check: 'tell me what u want'
                  }
                  window.hj('identify', userId, userAttributes);
                }
              }
            } catch (e) {
              console.error("[hotjar] boot failure:", e)
            }
          }, hotjarStartDelay);
        }
        window.onload = function () {
          console.log('[hotjar-recording] window.onload')
        }
        document.addEventListener('DOMContentLoaded', () => {
          console.log('[hotjar-recording] DOMContentLoaded')
          window.__hotjarInitCallback();
        });

        `
        }}></Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
