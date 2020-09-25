# Prop-Types-CSS
_Type checking with style_

## Usage
Prop-Types-CSS exposes all types defined by the CSS spec as type-checkers.
```js
Component.propTypes = {
    color: PropTypesCss.color // Will match any valid css color
};
```
Additionally, more specific checks for most types are available
```js
Component.propTypes = {
    color: PropTypesCss.color.hex // Will only match hex-colors
};
```
Fields can also be marked required in the same way as the prop-types library.
```js
Component.propTypes = {
    color: PropTypesCss.color.keyword.isRequired // Will yield an error when a null-ish value is passed
};
```

## Contributing
If you want to contribute, thank you in advance! More information on how to do so can be found in the CONTRIBUTING.md.