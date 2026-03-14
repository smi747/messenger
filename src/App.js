import Handlebars from "handlebars";
import testTemplate from "./components/test/test.hbs?raw";
import notFound from "./pages/notFound.hbs?raw";
import internalServerError from "./pages/internalServerError.hbs?raw";

Handlebars.registerPartial("test", testTemplate); 

document.getElementById('app').innerHTML = Handlebars.compile(testTemplate)();


export default class App {
  constructor() {
    this.state = {
      currentPage: 'notFound',
    };
    this.appElement = document.getElementById('app');
  }

  render() {
    let template;
    if (this.state.currentPage === 'notFound') {
      template = Handlebars.compile(notFound);
      this.appElement.innerHTML = template();
    } else {
      template = Handlebars.compile(internalServerError);
      this.appElement.innerHTML = template();
    }
    this.attachEventListeners();
  }

  attachEventListeners() {
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.changePage(e.target.dataset.page);
      });
    });
  }

  changePage(page) {
    this.state.currentPage = page;
    this.render();
  }

}
