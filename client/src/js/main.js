import htmlImporter from './utils/html-importer.js';
import { setupRouting } from './router/router.js';

htmlImporter('navbar-container', '/components/navbar.html');
htmlImporter('footer-container', '/components/footer.html');
setupRouting();