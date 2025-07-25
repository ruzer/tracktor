export default {
  title: 'Tracktor',
  description: 'Tracktor Documentation',
  base: '/',
  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    },
    siteTitle: 'Tracktor Docs',
    lastUpdated: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/introduction' },
      { text: 'API', link: '/api/authentication' },
      { text: 'Demo', link: 'https://tracktor-demo.bytedge.in' },
    ],
  sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Tracktor?', link: '/introduction' },
            { text: 'Deployment', link: '/deployment' },
            { text: 'Contributing', link: '/contributing' }
          ]
        },
        {
          text: 'API',
          items: [
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Vehicles', link: '/api/vehicles' },
            { text: 'Fuel Log', link: '/api/fuel-log' },
            { text: 'Maintenance Log', link: '/api/maintenance-log' },
            { text: 'PUCC', link: '/api/pucc' },
            { text: 'Insurance', link: '/api/insurance' }
          ]
        }
      ]
    }
  }
}