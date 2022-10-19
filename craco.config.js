const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#6A983C',
              '@layout-header-background': '#F9F9F9',
              '@success-color': '@primary-color'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};