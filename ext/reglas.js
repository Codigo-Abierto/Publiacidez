// Reglas por defecto para Filtros Base
function guardarListaReglasPorDefecto() {
  let lista_default = 
  [    
    {
      dominio: "eltiempo.es", 
      bloquear: [
        "*://*.g.doubleclick.net/*",
        "*://ad.doubleclick.net/*",
        "*://*.amazon-adsystem.com/*",
        "*://*/googima.js",
        "*://*.adsrvr.org/*",
        "*://*.taboola.com/*",
        "*://*.agkn.com/*",
        "*://*.hotjar.com/*",
        "*://*.krxd.net/*",
        "*://*.adnxs.com/*",
        "*://*.criteo.com/*",
        "*://*.richaudience.com/*",
        "*://*.indexww.com/*",
        "*://*.rubiconproject.com/*",
        "*://*.casalemedia.com/*",
        "*://*.a3cloud.com/*",
        "*://platform.twitter.com/*",
        "*://connect.facebook.net/*"
      ]
    },
    {
      dominio: "elpais.com",
      dinamico: true, 
      bloquear: [
        "*://static.criteo.net/js/ld/publishertag.prebid.js",
        "*://*.krxd.net/*",
        "*://static.chartbeat.com/js/chartbeat_video.js",
        "*://connect.facebook.net/*",
        "*://recomendador.prisa.com/recommendation/*",
        "*://c.amazon-adsystem.com/*",
        "*://ep00.epimg.net/js/pbs/prebid.js",
        "*://securepubads.g.doubleclick.net/*",
        "*://prisacom.demdex.net/*",
        "*://*.outbrain.com/*"        
      ],
      ocultar: [
        {sel: "div[class^='prisa_ad']", extend: "div[class^='third_']" } 
      ]
    },  
    {
      dominio: "eldiario.es",      
      dinamico: true,
      bloquear: [
        "*://*.adnxs.com/*",
        "*://pagead2.googlesyndication.com/pagead/*", 
        "*://g.doubleclick.net/*",      
        "*://*.consensu.org/*",
        "*://*.imasdk.googleapis.com/*",
        "*://dmxleo.dailymotion.com/*",
        "*://*/*/pagead/conversion.*"        
      ],
      ocultar:[
          "div[class~='no-adv-socios']"
      ]
    }, 
    {
      dominio: "elconfidencial.com",      
      dinamico: true,
      bloquear: [
        "*://*.marfeelcache.com/*",
        "*://*.adform.net/*",
        "*://*.privacy-center.org/*",
        "*://*.teads.tv/*",
        "*://*.insurads.com/*",    
        "*://www.googletagservices.com/tag/js/gpt.js*", 
        "*://*.google.com/pagead/*",    
        "*://widgets.outbrain.com/*",
        "*://*.hotjar.com/*"      
      ], 
      ocultar: [
        "div[class='group-sponsor']",        
        "div[class='group-sponsor']+article" 
      ]  
    },  
    {
      dominio: "elespanol.com",      
      dinamico: true,
      bloquear: [
        "*://*.npttech.com/advertising.js*",
        "*://*.privacy-center.org/*",
        "*://*.googleadservices.com/pagead/conversion.js*"
      ],  
      ocultar: [
        "div[class*='adv']"        
      ]
    },
    {
      dominio: "economiadigital.es",        
      bloquear: [
        "*://*.sascdn.com/*", 
        "*://*.smartadserver.com/*", 
        "*://*.marfeel.com/*", 
        "*://*.consensu.org/*", 
        "*://*.g.doubleclick.net/*"
      ]
    }, 
    {
      dominio: "huffingtonpost.es",      
      dinamico: true,
      bloquear: [
        "*://*.privacy-center.org/*", 
        "*://*.epimg.net/js/pbs/*",
        "*://*.consensu.org/*",
        "*://dmxleo.dailymotion.com/*",        
        "*://widgets.outbrain.com/outbrain.js",
        "*://dk79lclgtez2i.cloudfront.net/embed.js*",
        "https://imasdk.googleapis.com/js/sdkloader/ima3.js"
      ],  
      ocultar: [
        "#usrConsent",
        ".newsletter-toaster__inner-container",
        ".ad_spot",
        "#ad_right_rail_flex",
        "#ad_leaderboard_flex",
        ".follow-us__body"
      ],
      noscript:[
        {text: "function load_outbrainscript()"} 
      ]  
    },   
    {
      dominio: "libertaddigital.com",      
      dinamico: true,
      bloquear: [
        "*://*.onesignal.com/*",    
        "*://*.smartclip.net/*",
        "*://*.noddus.com/javascripts/card_loader.js",
        "*://*.consensu.org/*",
        "*://*.ultimedia.com/api/widget/getwidget/*",
        "*://*.outbrain.com/*",
        "*://*.hotjar.com/*",
        "*://*.ads.adaptv.advertising.com/*",
        "*://*.lkqd.net/*",
        "*://*/*prebid/prebid.js",
        "https://www.googletagservices.com/tag/js/gpt.js"      
      ],  
      ocultar: [
        "#mega-atfr",
        "div[class^='app_gdpr']",
        ".futurosantander"
      ]
    },     
    {
      dominio: "okdiario.com",      
      bloquear: [
        "*://*.g.doubleclick.net/*", 
        "*://*.privacy-center.org/*", 
        "*://*.onesignal.com/*", 
        "*://*.privacy-center.org/*", 
        "*://*.adform.ne/*", 
        "*://*.sitescout.com/*", 
        "*://*.taboola.com/*",
        "*://*.crwdcntrl.net/*",
        "https://okdiario.com/static/advertisement.js*"
      ]  
    }, 
    {
      dominio: "publico.es",      
      dinamico: true,
      bloquear: [
        "*://g.doubleclick.net/*",  
        "*://*.outbrain.com/*",
        "*://c.amazon-adsystem.com/*",        
        "*://*.teads.tv/*",
        "*://*.aniview.com/*",
        "*://*.privacy-center.org/*", 
        "*://*.20m.es/prebid/*"
      ],  
      ocultar: [
        ".ADBox",
        ".pb-ads-count",
        ".pb-megabanner"
      ]
    },
    {
      "dominio": "youtube.com",      
      "bloquear": [
        "*://tpc.googlesyndication.com/*",
        "*://googleads.g.doubleclick.net/*",
        "*://static.doubleclick.net/*",
        "*://www.google.com/pagead/*",
        "*://www.google.es/pagead/*",
        "*://www.youtube.com/get_midroll_*",
        "*://*.googlesyndication.com/sodar/*", //
        "*://*.youtube.com/*=adunit&*"
      ],
      "ocultar": [
        "div[id='masthead-ad']", //
        "#companion",
        "#player-ads",
        ".video-ads"
      ]
    },
    {
      "dominio": "twitch.tv",
      "bloquear": [
        "*://*.googletagservices.com/tag/js/gpt.js",
        "*://*.amazon-adsystem.com/*",
        "*://*.g.doubleclick.net/*",
        "*://sb.scorecardresearch.com/*", //        
        "wss://pubsub-edge.twitch.tv/*"   
      ],
      "ocultar": [
        "div[class~='consent-banner']",
        {
          "sel": "div[data-test-selector='sad-overlay']",
          "dinamico": true
        }
      ],
      "scripts": [
        {
          "codigo": "(function(){if(\"function\"==typeof fetch){var a=window.fetch;window.fetch=function(b){if(2<=arguments.length&&\"string\"==typeof b&&b.includes(\"/access_token\")){var d=new URL(arguments[0]);d.searchParams.delete(\"player_type\"),d.searchParams.set(\"platform\", \"_\"),arguments[0]=d.href}return a.apply(this,arguments)}}})();",
          "head": true
        },
        {
          "codigo": "if (typeof localStorage != 'undefined' && localStorage.setItem){localStorage.setItem('twilight.gdpr.preferences', '{\"version\":1,\"vendorPreferences\":{\"amazon\":false,\"comscore\":false,\"google\":false,\"nielsen\":false,\"salesforce_dmp\":false}}');}" 
        }	
      ]
    },         
    {
      dominio: "burbuja.info",      
      bloquear: [      
        "*://googleads.g.doubleclick.net/*",
        "*://static.doubleclick.net/*",
        "*://pagead2.googlesyndication.com/pagead/*",
        "*://*.g.doubleclick.net/*",
        "*://*.smartadserver.com/*",    
        "*://*/*/am/ads.*"  
      ],
      ocultar: [
        "aside[class='message-signature']", // firmas
        {sel: "div[class^='samCodeUnit']", set: {"class": "samIgnoreContent"}},
        {sel: "ins[class^='adsbygoogle']", set: {"class": "samIgnoreContent"}},
        {sel: "ins[id='vtx-position-0-mpu1']", extend: "div[class='block-container']", dinamico: true}
      ]
    },
    {
      dominio: "reddit.com",  
      dinamico: true,       
      bloquear: [
        "*://*/js/ads.*",
        "*://www.googletagservices.com/tag/js/gpt.js",
        "*://*.amazon-adsystem.com/*",
        "*://*.aaxads.com/*",
        "*://*/house-ads/*"
      ],
      ocultar: [        
        "div[data-before-content='advertisement']",
        ".promotedlink"
      ]
    },                    
    {
      "dominio": "twitter.com",
      "dinamico": true,
      "ocultar": [
        {sel: "div[data-testid='UserCell']", text: "(Promoted|Gesponsert|Promocionado|Sponsorisé|Sponsorizzato|Promowane|Promovido|Реклама|Uitgelicht|Sponsorlu|Mainostettu)$"},
        {sel: "div[data-testid='placementTracking']", text: "(Promoted|Gesponsert|Promocionado|Sponsorisé|Sponsorizzato|Promowane|Promovido|Реклама|Uitgelicht|Sponsorlu|Mainostettu)$"},
        {sel: "div", text: "^(Promocionado)", extend: "div[data-focusable=\"true\"]"}
      ]
    },
    {
      dominio: "pinterest.es",
      dinamico: true,
      ocultar: [
        {sel: "div[data-test-id='pin']", text: "^(Promocionado por)"}
      ]
    },
    {
      dominio: "facebook.com",  
      dinamico: true,  
      ocultar: [
        { 
          path: "^/$", 
          sel: "div[class='l9j0dhe7']", text: "^(Publicidad|Sponsored)"
        },
        {
          path: "^/$",
          //sel: "a[href^='/ads/about/']", //lo insertan dinamicamente cuando te metes encima, por lo que no sirve
          sel: "span[class='gpro0wi8 j1lvzwm4 stjgntxs ni8dbmo4 q9uorilb'] > span[class='b6zbclly myohyog2 l9j0dhe7 aenfhxwr l94mrbxd ihxqhq3m nc684nl6 t5a262vz sdhka5h4']",
          resel: "span:not([style*='position: absolute']", 
          text: "(ublicidad|ponsored)$",
          extend: "div[class='cbu4d94t j83agx80']"
        },
        {
          path: "^/$", //edge
          sel: "span[class='gpro0wi8 j1lvzwm4 stjgntxs ni8dbmo4 q9uorilb'] > b[class='b6zbclly myohyog2 l9j0dhe7 aenfhxwr l94mrbxd ihxqhq3m nc684nl6 t5a262vz sdhka5h4']",
          resel: "b:not([style*='display: none']",
          text: "(ublicidad|ponsored)$",
          extend: "div[class='cbu4d94t j83agx80']"
        }        
      ]
    },
    {
      dominio: "imdb.com",      
      dinamico: true,
      bloquear: [
        "*://*.media-imdb.com/*/imdbads/js/collections/tarnhelm-*.js",
        "*://*.ssl-images-amazon.com/images/*/DAsf-*",
        "*://*.amazon-adsystem.com/*",
        "https://m.media-amazon.com/images/G/01/csm/showads*.js"    
      ],  
      ocultar: [
        ".slot_wrapper"
      ]
    },
    {
      dominio: "w3schools.com",      
      bloquear: [
        "*://*.amazon-adsystem.com/*", 
        "*://static.h-bid.com/prebid/latest/prebid.js", 
        "*://*.googletagservices.com/tag/js/gpt.js", 
        "*://static.h-bid.com/sncmp/latest/sncmp.min.js"            
      ],  
      ocultar: [
        "#mainLeaderboard",
        ".sidesection > #skyscraper",
        ".bottomad"
      ]
    },
    {
      dominio: "forocoches.com",
      bloquear: [
        "*://amazon-adsystem.com/*",
        "*://*.g.doubleclick.net/*",
        "*://*.consensu.org/*",
        "*://*.leadzutw.com/*",
        "*://*.lzrikate.com/*",
        "*://*.leadzutw.com/*",
        "*://*.adnxs.com/*",
        "*://*.rubiconproject.com/*",
        "*://*.richaudience.com/*",
        "*://*.criteo.com/*",
        "*://*.smartadserver.com/*",
        "*://*.videostep.com/*/VideoAdContent*",
        "*://*.prebid.org/*", 
        "*://*.sddan.com/*",
        "*://*.pubmatic.com/*",    
        "*://*.openx.net/*",    
        "*://*.2mdn.net/*", 
        "*://*.agkn.com/*",
        "*://*.skimresources.com/*",        
        "*://*.static-od.com/*",
        "*://*.facebook.net/*/fbevents.js",
        "*://*.static.doubleclick.net/instream/ad_status.js",        
        "https://scripts.static-od.com/setup/?site=forocoches"        
      ],    
      ocultar: [
        ".infobck",
        {sel: "iframe[id^='postbid_']", dinamico: true}
      ]
    }    
  ];
  //.  
  for (let i=0; i < lista_default.length; i++){
    localStorage.setItem(lista_default[i].dominio, JSON.stringify(lista_default[i]));
    console.log("Guardadas reglas dominio:", lista_default[i].dominio);
  }  
}  

