# Job Interview - Front-end Developer / Vue - Test

## Development Set-up
This repository has a basic tooling in place to compile front-end code (HTML / SCSS / JS / Vue.js) through Webpack (based on a simplified version of the Nayan set-up).

* The necessary dependencies can be installed through `npm install`.
* `npm run build` triggers a one-time build.
* `npm run watch` starts a live reload development server.
* Source code can be found under the `src`-folder and is compiled to the `dist`-folder.
  
## Vue Components Set-up
At Nayan, we have a hybrid approach to Vue components that differs a bit to what you might find online / in tutorials. The complete page isn't built in Vue, Vue is only used to enrich certain components on the page.

The page itself is built in regular HTML. Normally, it's built server-side, but in this example, it's replaced by a [static HTML-file](./src/index.html). Within that page, you can use Vue components by adding a div-tag with a `data-vue-component` attribute:

``<div data-vue-component="Countdown"></div>``

This div will then be replaced by the corresponding Vue component (based on the list in [this file](./src/vue/index.js)). Other data attributes on the div will be passed as properties to the Vue component. e.g. `data-title` will be passed as the `title`-property of the Vue component. A basic example of this can be found in the [index.html](./src/index.html)-file & [Countdown.vue](./src/vue/Countdown/Countdown.vue) component.

## Aim
Make a fork of this repository (hosted on your own GitHub-account) and convert [this design](./documentation/design.png) into front-end code. You can also find the [PSD](./documentation/design.psd) in the same folder, but I've kept the design simple in case you don't have Photoshop available. You can find the texts used in the design [here](./documentation/design-text.md).

### General Guidance
* Translate the design to clean front-end code that works across all devices. Only a desktop-design is available, but use your own judgement to translate this to smaller screen sizes.
* Document your progress and thoughts, both within your code and in concise, clear commits.
* At Nayan, we aim to use BEM notation, so if you can prove your proficiency in this, that's a plus.
* You can add helper libraries if needed, but try to code the bulk of the page & actual components yourself so we can properly judge your skills.

### Advanced topics
The main aim is to just set up the page, but if you feel ready, you can tackle the following challenges (preferably in Vue.js):

* Have the countdown at the top actually count down to a specific date & time in real-time. Black Friday falls on 26/11/2021, but the component that you develop should be reusable for other situations.
* Handle the submit of the newsletter-form at the bottom through an AJAX request (using Axios). There's no real API endpoint available in this example, but you can simulate a POST-request to `/api/newsletter-subscribe/` with an `email` parameter.