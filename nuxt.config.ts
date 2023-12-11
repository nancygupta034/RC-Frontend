// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    target: 'server',
    ssr: true,
    alias:{
      "@components": "/components",
      "@node_modules": "/node_modules",
    },
    nitro: {
      preset: 'node-server', // Specify the Nitro preset
    },
    app: {
      baseURL: process.env.NODE_ENV == "development" ? process.env.NUXT_PUBLIC_API_BASE : '/', 
      head: {
        title: 'Responsive Centers for Psychology and Learning - Responsive Centers for Psychology and Learning',
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1',
        htmlAttrs: {
          lang: 'en'
        },
        link: [
          { 
            rel: 'preconnect', 
            href: 'https://fonts.googleapis.com' 
          },
          { 
            rel: 'stylesheet', 
            href: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;600;700&display=swap',
            crossorigin: '' 
          },
          { 
            rel: 'stylesheet', 
            href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css' 
          }
        ],
        script: [
          {}
        ],
        noscript: []
      },
    },
    modules: [
      // ...
      '@pinia/nuxt',
      'dayjs-nuxt'
    ],
    runtimeConfig: {
      public: {
        jsonUrl: 'https://rc.designthemes.com/json/',
        assetsDir: 'https://rc.designthemes.com/',
        apiUrl: 'https://manage.rc.designthemes.com/',
        backendAssetUrl: 'https://manage.rc.designthemes.com/',
        // jsonUrl: 'http://server/nnc/rc-cms-latest/frontend/server/json/',
        // assetsDir: '/_nuxt/',
        // apiUrl: 'http://192.168.0.118:8008/',
        // backendAssetUrl: 'http://192.168.0.118:8008/'
        // jsonUrl: process.env.NODE_ENV == "development" ? 'http://server/responsive-centers/server/json/' : 'https://rc.designthemes.com/json/',
        // assetsDir: process.env.NODE_ENV == "development" ? "/_nuxt/" : 'https://rc.designthemes.com/',
        // apiUrl: process.env.NODE_ENV == "development" ? 'http://192.168.1.118:8007/' : 'https://rc.designthemes.com/api/',
        // backendAssetUrl: process.env.NODE_ENV == "development" ? 'http://192.168.1.118:8007/api/' : 'https://rc.designthemes.com/api/',
      }
    },
    devtools: { enabled: true },
    css: ['~/assets/scss/app.scss'],
    plugins:[{ src: '~/plugins/vee-validate.js', mode: 'client' }],
    postcss: {
      plugins: {
        autoprefixer: {
          overrideBrowserslist: 'last 4 versions'
        },
      }
    },
    build: {
      transpile: ["@vee-validate/rules"],
    }
  })
  