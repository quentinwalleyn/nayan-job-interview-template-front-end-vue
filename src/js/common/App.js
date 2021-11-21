import Vue from 'vue';

import Module from './Module.js';
import { loadDynamicImport, initializeModule } from '../helpers/util.js';
import { $map, domReadyPromise, parseVueProps } from '../helpers/dom.js';

/**
 * App Entry Point Class
 * @extends Module
 * @category Common
 */
class App extends Module {
    async init(dependencies) {
        await this.initDependencies(dependencies);
        await this.onPageLoad();
    }

    async initDependencies(dependencies) {
        this.dependencies = dependencies;
        this.vue = Vue;
        Vue.prototype.$app = this;
    }

    async onPageLoad() {
        // Await DOM ready before rest of execution
        await domReadyPromise();
        await this.initVueComponents(document.body);
    }

    /**
     * Initializes Vue Components within given container
     * @param {Node|string} container DOM Element (or selector)
     * @returns {Promise} Load Promise
     */
    initVueComponents(container) {
        const promises = $map(container, '[data-vue-component]', ($el) => {
            const { vueComponent, ...props } = $el.dataset;

            return this.initVueComponent($el, vueComponent, props);
        });

        return Promise.all(promises).then((newComponents) => {
            this.vueComponents = (this.vueComponents || []).concat(newComponents);
        });
    }

    /**
     * Initializes a single Vue Component
     * @param {Node} $el DOM Element
     * @param {string} vueComponent Vue Component ID
     * @param {Object} props Component properties
     * @returns {void}
     */
    initVueComponent($el, vueComponent, props) {
        if (vueComponent in (this.dependencies.vueComponents || {})) {
            return loadDynamicImport(this.dependencies.vueComponents[vueComponent], (Component) => {
                if (Component.props && props) {
                    props = parseVueProps(Component.props, props);
                }

                return new Vue({
                    el: $el,
                    render: (h) => h(Component, { props })
                });
            });
        }

        return Promise.resolve();
    }

    /**
     * Initializes Vue Components within given container
     * @param {Node|string} container DOM Element (or selector)
     * @returns {Promise} Load Promise
     */
    initComponents(container) {
        const promises = $map(container, '[data-component]', ($el) => {
            const { component } = $el.dataset;

            return this.initComponent(component, $el);
        });

        return Promise.all(promises).then((newComponents) => {
            this.components = (this.components || []).concat(newComponents);
        });
    }

    /**
     * Initializes a single component
     * @param {string} component Component Name
     * @param {Node} $el DOM element to pass to module
     * @returns {Promise} Load Promise
     */
    initComponent(component, $el) {
        if (component in (this.dependencies.components || {})) {
            return this.initModule(this.dependencies.components[component], $el, true);
        }

        return Promise.resolve();
    }

    /**
     * Loads & initializes given module
     * @param {function|Module|Promise} initiator Initiator for dynamic import
     * @param {Node} $el DOM element to pass to module
     * @param {Boolean} init Immediately run init-function after module load
     * @returns {Promise} Load Promise
     */
    initModule(initiator, $el, init) {
        return initializeModule(initiator, this, $el, init);
    }
}

export default App;
