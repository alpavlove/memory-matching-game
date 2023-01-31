const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind')
const { join } = require('path')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      transitionDelay: {
        0: '0ms',
        250: '250ms',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.flip': {
          transform: 'rotateY(180deg)',
        },
      })
    }),
  ],
}
