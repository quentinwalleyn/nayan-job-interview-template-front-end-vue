import { convertString } from '../helpers/util.js';

/**
 * Helpers for DOM Manipulation functionalities
 *
 * @category Helpers
 * @module dom
 */

/**
 * Detects whether given argument is DOM Element
 * Based on https://stackoverflow.com/a/36894871
 * @param {Element} element DOM Element for Container
 * @returns {Boolean} Element Status
 */
export function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}

/**
 * Transforms selector into actual DOM Element
 * @param {Node|string} selector DOM Element for Container
 * @returns {Node} Result
 */
export function getElement(selector) {
    if (isElement(selector)) {
        return selector;
    }

    if (typeof selector === 'string') {
        return document.querySelector(selector);
    }

    if (typeof selector === 'undefined') {
        return document;
    }

    return null;
}

/**
 * Maps all matching elements within given container
 * @param {Node|string} container DOM Element (or selector) to search in
 * @param {string} selector Query Selector
 * @param {function} fn Function to execute
 * @returns {Array} Result Array
 */
export function $map(container, selector, fn) {
    const $container = getElement(container);

    if ($container) {
        const nodes = $container.querySelectorAll(selector);
        return Array.prototype.map.call(nodes, fn);
    }

    return null;
}

/**
 * Executes given function for all matching elements within given container
 * @param {Node|string} container DOM Element (or selector) to search in
 * @param {string} selector Query Selector
 * @param {function} fn Function to execute
 * @returns {void}
 */
export function $forEach(container, selector, fn) {
    const $container = getElement(container);

    if ($container) {
        const nodes = $container.querySelectorAll(selector);
        Array.prototype.forEach.call(nodes, fn);
    }
}

/**
 * Gets offset for element within the complete page
 * (not just in parent).
 * @param {Node} element DOM Element
 * @param {Boolean} horizontal Get horizontal offset
 * @returns {number} Offset
 */
export function getOffset(element, horizontal = false) {
    if (!element) return 0;
    return (
        getOffset(element.offsetParent, horizontal) +
        (horizontal ? element.offsetLeft : element.offsetTop)
    );
}

/**
 * Triggers function on DOM ready or immediately (if DOM is already ready)
 * @param {function} fn Function to run on DOM ready
 * @returns {void}
 */
export function domReady(fn) {
    // If late; I mean on time.
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * Returns Promise that will be resolved when DOM is ready
 * @returns {Promise} DOM Ready Promise
 */
export function domReadyPromise() {
    return new Promise((resolve) => {
        domReady(() => {
            resolve();
        });
    });
}

/**
 * Triggers function on Window ready or immediately (if window is already ready)
 * @param {function} fn Function to run on window ready
 * @returns {void}
 */
export function windowReady(fn) {
    if (document.readyState === 'complete') {
        fn();
    } else {
        window.addEventListener('load', fn);
    }
}

/**
 * Returns Promise that will be resolved when window is ready
 * @returns {Promise} Window Ready Promise
 */
export function windowReadyPromise() {
    return new Promise((resolve) => {
        windowReady(() => {
            resolve();
        });
    });
}

/**
 * Calculates element width (with or without margin)
 * @param {Node} el DOM Element
 * @param {Boolean} includeMargin Include Margin
 * @returns {Number} Outer Width
 */
export function outerHeight(el, includeMargin) {
    let height = el.offsetHeight;

    if (includeMargin) {
        const style = getComputedStyle(el);
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }

    return height;
}

/**
 * Calculates element width (with or without margin)
 * @param {Node} el DOM Element
 * @param {Boolean} includeMargin Include Margin
 * @returns {Number} Outer Width
 */
export function outerWidth(el, includeMargin) {
    let width = el.offsetWidth;

    if (includeMargin) {
        const style = getComputedStyle(el);
        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width;
}

/**
 * Creates new element with given class names
 * & appends it to the given parent element
 * @param {Node|Selector} parent Parent DOM Element
 * @param {string} className Classes to add to new element
 * @param {string} tag Tag of new element
 * @returns {Node} New DOM element
 */
export function appendElement(parent, className, tag) {
    const $parent = getElement(parent);

    if ($parent) {
        const $el = document.createElement(tag || 'div');
        $el.className = className;
        $parent.append($el);

        return $el;
    }

    return null;
}

/**
 * Removes one or more class names from the given list of elements
 * @param {Array|NodeList} array List of DOM Elements
 * @param  {...string} classNames Class Name(s) to remove
 * @returns {void}
 */
export function removeClass(array, ...classNames) {
    if (array) {
        array = typeof array === 'object' && typeof array.length === 'number' ? array : [array];
        Array.prototype.forEach.call(array, ($el) => {
            classNames.forEach((className) => {
                $el.classList.remove(className);
            });
        });
    }
}

/**
 * Removes one or more class names from the given list of elements
 * @param {Array|NodeList} array List of DOM Elements
 * @param  {...string} classNames Class Name(s) to add
 * @returns {void}
 */
export function addClass(array, ...classNames) {
    if (array) {
        array = typeof array === 'object' && typeof array.length === 'number' ? array : [array];
        Array.prototype.forEach.call(array, ($el) => {
            classNames.forEach((className) => {
                $el.classList.add(className);
            });
        });
    }
}

/**
 * Toggles one or more class names from the given list of elements
 * @param {Array|NodeList} array List of DOM Elements
 * @param  {...string} classNames Class Name(s) to toggle
 * @returns {void}
 */
export function toggleClass(array, ...classNames) {
    if (array) {
        array = typeof array === 'object' && typeof array.length === 'number' ? array : [array];
        Array.prototype.forEach.call(array, ($el) => {
            classNames.forEach((className) => {
                $el.classList.toggle(className);
            });
        });
    }
}

/* * Adds or removes one or more class names from the given list of elements
 * @param {Array|NodeList} array List of DOM Elements
 * @param  {Boolean} status Class Name(s) to add
 * @param  {...string} classNames Class Name(s) to add
 * @returns {void}
 */
export function setClass(array, status, ...classNames) {
    if (status) {
        addClass(array, ...classNames);
    } else {
        removeClass(array, ...classNames);
    }
}

/**
 * checks if element is in Viewport
 * @param {Node} element - Dom Element
 * @param {Boolean} partially - boolean indiciating if element has to be partially in viewport or fully
 * @param {Number} percentageVisible -
 * @returns {Boolean} returns true if in viewport
 */
export function isInViewport(element, partially, percentageVisible) {
    const distance = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    let distanceTop = distance.top;
    let distanceRight = distance.right;
    let distanceBottom = distance.bottom;
    let distanceLeft = distance.left;

    if (percentageVisible) {
        const verticalDistanceToSubstract = distance.height * percentageVisible;
        const horizontalDistanceToSubstract = distance.width * percentageVisible;

        distanceTop += verticalDistanceToSubstract;
        distanceRight -= horizontalDistanceToSubstract;
        distanceBottom -= verticalDistanceToSubstract;
        distanceLeft += horizontalDistanceToSubstract;
    }

    const contentVisible =
        (distanceTop < 0 && distanceBottom > windowHeight) ||
        (distanceLeft < 0 && distanceRight > windowWidth);
    const topVisible = distanceTop >= 0 && distanceTop <= windowHeight;
    const rightVisible = distanceRight >= 0 && distanceRight <= windowWidth;
    const bottomVisible = distanceBottom >= 0 && distanceBottom <= windowHeight;
    const leftVisible = distanceLeft >= 0 && distanceLeft <= windowWidth;

    if (partially) {
        return contentVisible || ((topVisible || bottomVisible) && (leftVisible || rightVisible));
    }

    return topVisible && rightVisible && bottomVisible && leftVisible;
}

/**
 * Checks if element is visible
 * @param {Node} $el DOM Element
 * @returns {Boolean} Element Visibility
 */
export function isVisible($el) {
    return !!($el.offsetWidth || $el.offsetHeight || $el.getClientRects().length);
}

/**
 * Attaches an event handler to one or more DOM elements.
 * Optionally, specify selector to filter on child descendants
 * that should trigger the event.
 * @param {string|Node|NodeList|Array} el DOM Element (or selector for) to add listener to
 * @param {string} eventName Event name (e.g. click)
 * @param {string} selector Selector for child elements (optional)
 * @param {function} handler Event handler
 * @param {object} options Event handler options
 * @returns {void}
 */
export function addEventListener(el, eventName, selector, handler, options) {
    let $els = [document];

    if (typeof el === 'object' && typeof el.length === 'number') {
        $els = el;
    } else if (typeof el === 'string') {
        $els = document.querySelectorAll(el);
    } else if (isElement(el)) {
        $els = [el];
    }

    Array.prototype.forEach.call($els, ($el) => {
        $el.addEventListener(
            eventName,
            (event) => {
                if (typeof selector !== 'string') {
                    handler.call(event.target, event);
                } else {
                    // .contains is a non-standard method on document,
                    // so use body instead in that case
                    const $srcEl = $el instanceof HTMLDocument ? $el.body : $el;
                    const closest = event.target.closest(selector);

                    if (closest && $srcEl.contains(closest)) {
                        handler.call(closest, event);
                    }
                }
            },
            options || {}
        );
    });
}

/**
 * Retrieves dataset from DOM element.
 * If a prefix is specified, only the keys starting
 * with this prefix or retrieved. The prefix is also
 * removed from the final key (and it's transformed to Camel Case)
 * @param {Node|Object} obj DOM Element or Object
 * @param {string} prefix Prefix
 * @returns {Object} Filtered Dataset
 */
export function getDataset(obj, prefix) {
    let dataset = {};
    const output = {};

    if (isElement(obj)) {
        dataset = obj.dataset;
    } else if (typeof obj === 'object' && obj !== null) {
        dataset = obj;
    }

    Object.entries(dataset).forEach(([key, value]) => {
        let valid = true;

        if (prefix) {
            const regex = new RegExp(`^${prefix}`);
            if (regex.test(key)) {
                key = key.replace(regex, '');
                key = key.charAt(0).toLowerCase() + key.substring(1);
            } else {
                valid = false;
            }
        }

        if (valid && key) {
            let val;
            try {
                val = JSON.parse(value);
            } catch (e) {
                val = value;
            }
            output[key] = val;
        }
    });

    return output;
}

export function parseVueProps(propDefs, props) {
    const filteredProps = Object.entries(propDefs)
        .map(([key, propDef]) => {
            if (!props?.[key]) {
                return null;
            }

            let prop = props[key];
            let requestedTypes;
            if (typeof propDef === 'function') {
                requestedTypes = [propDef];
            } else if (Array.isArray(propDef) && typeof propDef?.[0] === 'function') {
                requestedTypes = propDef;
            } else if (typeof propDef === 'object' && propDef?.type) {
                requestedTypes = [propDef.type];
            }

            prop = convertString(prop, requestedTypes);

            return [key, prop];
        })
        .filter(Boolean);

    const output = Object.fromEntries(filteredProps);

    return output;
}

/**
 * Converts Camel Case String to kebab case
 * (e.g. camelCase to camel-case)
 * @param {string} string Input String
 * @returns {string} kebab-case string
 */
export function camelToKebabCase(string) {
    return string
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
        .toLowerCase();
}
