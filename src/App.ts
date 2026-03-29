import Handlebars from "handlebars";

import { logInData } from "./pages/logIn/logInData.js";
import { signUpData } from "./pages/signUp/signUpData.js";
import userProfile from "./pages/userProfile/userProfileData.js";

import chatList from "./pages/chatList/chatList.hbs?raw";
import internalServerError from "./pages/internalServerError/internalServerError.hbs?raw";
import logIn from "./pages/logIn/logIn.hbs?raw";
import notFound from "./pages/notFound/notFound.hbs?raw";
import signUp from "./pages/signUp/signUp.hbs?raw";

import auth from "./components/auth/auth.hbs?raw";
import header from "./components/header/header.hbs?raw";
import link from "./components/linkElement/link.hbs?raw";
import error from "./components/error/error.hbs?raw";
import chat from "./pages/chatList/components/chat.hbs?raw";
import message from "./pages/chatList/components/message.hbs?raw";
Handlebars.registerPartial("Auth", auth);
Handlebars.registerPartial("Header", header);
Handlebars.registerPartial("Link", link);
Handlebars.registerPartial("Error", error);
Handlebars.registerPartial("Chat", chat);
Handlebars.registerPartial("Message", message);

export default class App {
  private state: {
    currentPage: string;
  };

  private appElement: HTMLElement;
  private eventUpdater: () => void;

  constructor() {
    this.state = {
      currentPage: "chatList",
    };

    const element = document.getElementById("app");
    if (!element) {
      throw new Error("Element with id 'app' not found");
    }

    this.appElement = element;
    this.eventUpdater = this.attachEventListeners.bind(this);
  }

  render(): void {
    let template: Handlebars.TemplateDelegate;

    if (this.state.currentPage === "chatList") {
      template = Handlebars.compile(chatList);
      this.appElement.innerHTML = template({});
    } else if (this.state.currentPage === "internalServerError") {
      template = Handlebars.compile(internalServerError);
      this.appElement.innerHTML = template({});
    } else if (this.state.currentPage === "logIn") {
      template = Handlebars.compile(logIn);
      this.appElement.innerHTML = template({ logInData, isLogin: true });
    } else if (this.state.currentPage === "notFound") {
      template = Handlebars.compile(notFound);
      this.appElement.innerHTML = template({});
    } else if (this.state.currentPage === "signUp") {
      template = Handlebars.compile(signUp);
      this.appElement.innerHTML = template({ signUpData, isLogin: false });
    } else if (this.state.currentPage === "userProfile") {
      const profile = new userProfile(this.appElement, this.eventUpdater);
      profile.render();
    }

    this.attachEventListeners();
  }

  attachEventListeners(): void {
    const headerLinks = document.querySelectorAll<HTMLElement>(".header-link");

    headerLinks.forEach((link) => {
      link.addEventListener("click", (e: Event) => {
        e.preventDefault();

        const target = e.currentTarget as HTMLElement;
        const page = target.dataset.page;

        if (page) {
          this.changePage(page);
        }
      });
    });
  }

  changePage(page: string): void {
    this.state.currentPage = page;
    this.render();
  }
}
