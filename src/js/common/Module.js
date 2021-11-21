/**
 * Generic Module functionality
 * @category Common
 */
class Module {
    $cache = {};
    $elements = {};
    storeWatchers = [];

    constructor(app, $el) {
        if (app) {
            this.app = app;
        }

        if ($el) {
            this.$el = $el;
        }
    }

    init() {
        this.initCache();
    }

    initCache() {
        Object.entries(this.$cache).forEach(([key, selector]) => this.addToCache(key, selector));
    }

    addToCache(key, selector, keepArray) {
        const $result = (this.$el || document).querySelectorAll(selector);

        if ($result && $result.length > 0) {
            if (!keepArray && $result.length === 1) {
                this.$elements[key] = $result[0];
            } else {
                this.$elements[key] = Array.from($result);
            }
        }
    }
}

export default Module;
