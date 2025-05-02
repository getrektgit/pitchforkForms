module.exports = {
    presets: [
      '@babel/preset-env',   // For modern JavaScript features
      '@babel/preset-react', // For JSX support (React)
    ],
    plugins: [
      '@babel/plugin-transform-runtime', // Helps with async/await and other features
    ],
  };
  