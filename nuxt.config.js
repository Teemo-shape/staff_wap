module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'T严选-TCL员工购物平台,TCL员工之家,TCL内部员工购物商城',
    meta: [{ charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'T严选商城隶属TCL集团电子商务中心（惠州酷友网络科技有限公司），是TCL员工专属购物平台，是TCL集团认证的官方商城。T严选商城所售商品均为原装正品，并开具电子发票，支持全国联保。' },
    { hid: 'keywords', name: 'keywords', content: 'T严选,TCL员工之家,TCL内部购物平台,TCL官方网上商城' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    // script: [{ src: '/js/utils.js' }]

    // script: [
    // { src: 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js' }
    // ]

  },
  plugins: [{ src: '~plugins', ssr: true }],
  cache: false,
  /*
   ** Customize the progress-bar color
   */
  /* loading: { color: 'red', height: '3px' }, */
  loading: '~/components/loading.vue',
  scrollToTop: false,
  transition: { name: 'fade', mode: 'out-in' },
  // performance: { prefetch: false },/*预加载策略 */
  /*
   ** Build configuration
   */
  // env: {
  //   baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  // },
  nuxt: {
    "host": "0.0.0.0",
    "port": "3008"
  },
  build: {
    vendor: ['axios'],
    // filenames: { vendor: 'vendor.[hash].js', app: 'app.[chunkhash].js' },
    /* analyze: {
      analyzerMode: 'server',
      analyzerHost: '10.120.54.48',
      analyzerPort: 3000,
    }, */
    /*  babel: {
       presets: ['es2016', 'stage-0']
     },  */
    /* plugins: [[
      'transform-runtime',
      {
        // 'helpers': false,
        'polyfill': false,
        'regenerator': true,
        // 'moduleName': 'babel-runtime'
      }
    ]], */
    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      config.devtool = false
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          // loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*   modules: [
      '@nuxtjs/proxy'
    ],
    proxy: [
      ['/rest', {
        target: 'http://10.120.54.70'
      }]
    ] */
}
