module.exports = function (api) {
  const isTest = api.env('test');

  return isTest
    ? {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript'
        ]
      }
    : {};
};
