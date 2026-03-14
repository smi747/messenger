import Handlebars from "handlebars";

import chatList from "./pages/chatList.hbs?raw";
import internalServerError from "./pages/internalServerError.hbs?raw";
import logIn from "./pages/logIn.hbs?raw";
import notFound from "./pages/notFound.hbs?raw";
import signUp from "./pages/signUp.hbs?raw";
import userProfile from "./pages/userProfile.hbs?raw";

import footer from './components/Footer/footer.hbs?raw';
import link from './components/Link/link.hbs?raw';
Handlebars.registerPartial('Footer', footer);
Handlebars.registerPartial('Link', link);


export default class App {
  constructor() {
    this.state = {
      currentPage: 'notFound',
    };
    this.appElement = document.getElementById('app');
  }

  render() {
    let template;
    if (this.state.currentPage === 'chatList') {
      template = Handlebars.compile(chatList);
      this.appElement.innerHTML = template();
    } else if (this.state.currentPage === 'internalServerError') {
      template = Handlebars.compile(internalServerError);
      this.appElement.innerHTML = template();
    } else if (this.state.currentPage === 'logIn') {
      template = Handlebars.compile(logIn);
      this.appElement.innerHTML = template();
    } else if (this.state.currentPage === 'notFound') {
      template = Handlebars.compile(notFound);
      this.appElement.innerHTML = template();
    } else if (this.state.currentPage === 'signUp') {
      template = Handlebars.compile(signUp);
      this.appElement.innerHTML = template();
    } else if (this.state.currentPage === 'userProfile') {
      template = Handlebars.compile(userProfile);
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
