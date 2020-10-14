/* eslint-env node */

/**
 * A `null` value will be used for *.css, *.less imports during testing
 *
 * Because webpack is not used by jest, parsing style imports directly will throw an error
 * This file will be used to replace all style imports as configured in jest.config.js#moduleNameMapper
 *
 * More info: https://jestjs.io/docs/en/webpack
 *
 * @type {any}
 */
module.exports = null;
