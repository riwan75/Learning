module.exports = {
  presets: [
    ["module:@react-native/babel-preset", { useTransformReactJSXExperimental: true }],
  ],
  plugins: [
    ["@babel/plugin-transform-react-jsx", { runtime: "automatic", importSource: "react-native-css-interop" }],
    "react-native-css-interop/dist/babel-plugin",
    "react-native-worklets/plugin",
  ],
}
