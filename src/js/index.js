import '../scss/main.scss';
import App from './common/App.js';
import vueComponents from '../vue';

// eslint-disable-next-line
__webpack_public_path__ = window.publicPath || '/';

const app = new App();
app.init({
    vueComponents
});
