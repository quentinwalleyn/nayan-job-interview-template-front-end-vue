/**
 * Generic utils
 *
 * @category Helpers
 * @module util
 */

import Module from '../common/Module.js';

const loadedJSFiles = {};
const loadedCSSFiles = [];

/**
 * Loads given JS file by inserting script tag in document.
 * @param {string} url URL to JS file
 * @param {boolean} async Executes script async
 * @returns {Promise} Promise for script load
 */
export function loadJSFile(url, async) {
    if (url && typeof url === 'string') {
        if (!Object.keys(loadedJSFiles).includes(url)) {
            loadedJSFiles[url] = new Promise((resolve) => {
                const firstScriptTag = document.getElementsByTagName('script')[0];
                const newScriptTag = document.createElement('script');

                newScriptTag.src = url;

                if (async) {
                    newScriptTag.async = true;
                }

                newScriptTag.addEventListener('load', () => resolve(true), false);
                newScriptTag.addEventListener('error', () => resolve(false), false);

                firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag);
            });
        }

        return loadedJSFiles[url];
    }

    return Promise.resolve();
}

/**
 * Loads given CSS file by inserting script tag in document.
 * @param {string} url URL to CSS file
 * @returns {Promise} Promise for script load
 */
export function loadCssFile(url) {
    if (url && typeof url === 'string' && loadedCSSFiles.indexOf(url) < 0) {
        return new Promise((resolve) => {
            // make a stylesheet link
            const cssFile = document.createElement('link');
            cssFile.rel = 'stylesheet';
            cssFile.href = url;
            // insert it at the end of the head in a legacy-friendly manner
            document.head.insertBefore(
                cssFile,
                document.head.childNodes[document.head.childNodes.length - 1].nextSibling
            );
            loadedCSSFiles.push(url);
            resolve();
        });
    }

    return Promise.resolve();
}

/**
 * Handles different cases for dynamic imports:
 * (wrapped) promises or actual export (in case of eager dynamic import)
 * @param {function|Module|Promise} initiator Initiator for dynamic import
 * @param {function} cb Function that's executed once promise is resolved
 * @returns {Promise} Promise for dynamic import execution
 */
export async function loadDynamicImport(initiator, cb) {
    let result;

    if (typeof initiator === 'function' && !(initiator.prototype instanceof Module)) {
        initiator = initiator();
    }

    try {
        result = await Promise.resolve(initiator);

        // Handle default exports
        if (result && typeof result === 'object' && 'default' in result) {
            result = result.default;
        }

        if (typeof result === 'function' && !(result.prototype instanceof Module)) {
            result = result();
        }

        result = await Promise.resolve(result);

        if (typeof cb === 'function') {
            result = cb(result);
        }
    } catch (e) {
        console.error(e);
    }

    return result;
}

/**
 * Loads & initializes given module
 * @param {function|Module|Promise} initiator Initiator for dynamic import
 * @param {App} app App instance
 * @param {Node} el DOM element to pass to module
 * @param {Boolean} init Immediately run init-function after module load
 * @returns {Promise} Promise for include
 */
export function initializeModule(initiator, app, el, init) {
    init = typeof init === 'boolean' ? init : true;

    return loadDynamicImport(initiator, (Include) => {
        if (Include) {
            const include = new Include(app, el);

            if (init && typeof include?.init === 'function') {
                include.init();
            }

            return include;
        }

        return null;
    });
}

/**
 * Returns promise that resolves after x milliseconds
 * @param {number} timeout Timeout amount in milliseconds
 * @returns {Promise} Promise
 */
export function wait(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

/**
 * Checks whether given date is valid
 * @param {Date} date Input Date
 * @returns {boolean} Validity
 */
export function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
}

/**
 * Tries to parse a string to one of the requested primitive types.
 * First type that matches is returned.
 * @param {string} str Input String
 * @param {Array} requestedTypes List of requested primitive types
 * @returns {*} Output
 */
export function convertString(str, requestedTypes) {
    if (typeof str !== 'string' || !Array.isArray(requestedTypes) || requestedTypes.length === 0) {
        return null;
    }

    let output;
    for (let i = 0; i < requestedTypes.length; i++) {
        const type = requestedTypes[i];
        switch (type) {
            case Number:
                output = parseFloat(str);
                break;
            case Date:
                output = parseISODate(str);
                break;
            case Boolean:
            case Array:
            case Object:
                try {
                    output = JSON.parse(str);
                } catch (e) {
                    console.log(e);
                }
                break;
            default:
                output = str;
                break;
        }

        if (output instanceof type) {
            break;
        }
    }

    return output;
}

/**
 * Parses an (incomplete) ISO 8601-1 date string
 * and converts it to a Date object
 * @param {string} dateString Date string
 * @returns {Date} Output date
 */
export function parseISODate(dateString) {
    const regex =
        /^(-?(?:[1-9][0-9]*)?[0-9]{4})-?(1[0-2]|0[1-9])-?(3[01]|0[1-9]|[12][0-9])(T(2[0-3]|[01][0-9]):([0-5][0-9])(:([0-5][0-9]))?(\.[0-9]{3})?(Z|((\+|-)[0-9]{2}:[0-9]{2}))?)?$/;

    if (dateString && regex.test(dateString)) {
        const matches = regex.exec(dateString);
        const year = matches[1];
        const month = matches[2];
        const day = matches[3];
        const hour = matches[5] || '00';
        const minutes = matches[6] || '00';
        const seconds = matches[8] || '00';
        const milliseconds = matches[9] || '.000';
        const timezone = matches[10] || 'Z';

        const fullDateString = `${year}-${month}-${day}T${hour}:${minutes}:${seconds}${milliseconds}${timezone}`;
        const date = new Date(fullDateString);

        if (isValidDate(date)) {
            return date;
        }
    }

    return null;
}
