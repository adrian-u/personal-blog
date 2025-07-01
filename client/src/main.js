import htmlImporter from './js/utils/html-importer.js';
import { setupRouting } from './js/router/router.js';

htmlImporter('navbar-container', './src/components/navbar.html');
htmlImporter('footer-container', './src/components/footer.html');
setupRouting();