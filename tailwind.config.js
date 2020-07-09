module.exports = {
  important: true,
  theme: {
    extend: {}
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    textColor: ['responsive', 'hover', 'focus', 'active']
  },
  plugins: [
    ({addComponents}) => {
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