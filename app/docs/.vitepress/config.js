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
      { text: 'API', link: '/api/authentication' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Tracktor?', link: '#what-is-tracktor' },
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