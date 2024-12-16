const path = require('path')

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: './src/main.jsx', // Entry point of the app
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js' // The name of the output file
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allow imports without extensions
  },
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from "dist"
    port: 3000, // Dev server port
    hot: true, // Enable Hot Module Replacement (HMR)
    open: true, // Automatically opens the browser
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Handle .js and .jsx files
        exclude: /node_modules/, // Ignore files in node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'] // Babel presets
          }
        }
      },
      {
        test: /\.css$/, // Handle CSS imports
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Handle images
        type: 'asset/resource'
      }
    ]
  }
}
