module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          esmodules: false
        }
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ]
}
