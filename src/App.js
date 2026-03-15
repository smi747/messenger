import Handlebars from "handlebars";

import {logInData} from "./pages/logIn/logInData.js";
import {signUpData} from "./pages/signUp/signUpData.js";

import chatList from "./pages/chatList/chatList.hbs?raw";
import internalServerError from "./pages/internalServerError/internalServerError.hbs?raw";
import logIn from "./pages/logIn/logIn.hbs?raw";
import notFound from "./pages/notFound/notFound.hbs?raw";
import signUp from "./pages/signUp/signUp.hbs?raw";
import userProfile from "./pages/userProfile/userProfile.hbs?raw";

import auth from './components/auth/auth.hbs?raw';
import header from './components/header/header.hbs?raw';
import link from './components/link/link.hbs?raw';
Handlebars.registerPartial('Auth', auth);
Handlebars.registerPartial('Header', header);
Handlebars.registerPartial('Link', link);

export default class App {
  constructor() {
    this.state = {
      currentPage: 'logIn',
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
      this.appElement.innerHTML = template({logInData, isLogin: true});
    } else if (this.state.currentPage === 'notFound') {
      template = Handlebars.compile(notFound);
      this.appElement.innerHTML = template();
    } else if (this.state.currentPage === 'signUp') {
      template = Handlebars.compile(signUp);
      this.appElement.innerHTML = template({signUpData, isLogin: false});
    } else if (this.state.currentPage === 'userProfile') {
      template = Handlebars.compile(userProfile);
      this.appElement.innerHTML = template();
    }
    this.attachEventListeners();
  }

  attachEventListeners() {
    const headerLinks = document.querySelectorAll('.header-link');
    headerLinks.forEach(link => {
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
