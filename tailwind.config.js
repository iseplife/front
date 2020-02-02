module.exports = {
  important: true,
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [
    ({ addComponents }) => {
      const AppLogo = {
        '.font-dinotcb': {
          fontFamily: 'DinotCB',
        },
        '.font-dinotcl': {
          fontFamily: 'DinotCL',
        },
        '.font-dinotl': {
          fontFamily: 'DinotL',
        },
        '.font-dinot': {
          fontFamily: 'Dinot',
        },
        '.font-dinotm': {
          fontFamily: 'DinotM',
        },
      };
      addComponents(AppLogo)
    }
  ]
};