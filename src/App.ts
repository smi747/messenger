import Handlebars from "handlebars";

//import { logInData } from "./pages/logIn/logInData.js";
//import { signUpData } from "./pages/signUp/signUpData.js";
//import userProfile from "./pages/userProfile/userProfileData.js";

//import chatList from "./pages/chatList/chatList.hbs?raw";
//import internalServerError from "./pages/internalServerError/internalServerError.hbs?raw";
//import logIn from "./pages/logIn/logIn.hbs?raw";
//import notFound from "./pages/notFound/notFound.hbs?raw";
//import signUp from "./pages/signUp/signUp.hbs?raw";

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

import {registerComponent} from './framework/ComponentRegistry';
import Link from './components/linkElement/link';
import Error_ from './components/error/error';
import Auth from './components/auth/auth';
import Header from './components/header/header';
import Message from './pages/chatList/components/message';
import Chat from './pages/chatList/components/chat';
import ChatList from './pages/chatList/chatList';
import NotFound from './pages/notFound/notFound';
import LogIn from './pages/logIn/logIn';
import SignUp from './pages/signUp/signUp';
import InternalServerError from './pages/internalServerError/internalServerError';
import UserProfile from './pages/userProfile/userProfile';

registerComponent(Link);
registerComponent(Error_);
registerComponent(Auth);
registerComponent(Header);
registerComponent(Message);
registerComponent(Chat);

const messages = [{content: "Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.", my: "", time: "0:00"},{content: "Круто!", my: "1", time: "13:25"}];
const chats = [{name: "Имя", content: "Содержимое", time: "10:00", indicator: "1"}];
const userProfileData = {
  name: "Иван",
  data: [
    { name: "Почта", value: "pochta@yandex.ru", name_: "email" },
    { name: "Логин", value: "ivanivanov", name_: "login" },
    { name: "Имя", value: "Иван", name_: "second_name" },
    { name: "Фамилия", value: "Иванов", name_: "first_name" },
    { name: "Имя в чате", value: "Иван", name_: "display_name" },
    { name: "Телефон", value: "8 800 000 00 00", name_: "phone" },
  ],
};

const ChatList_ = new ChatList({ messages: messages, chats: chats });
const ChatListElement = ChatList_.element();

const NotFound_ = new NotFound({  });
const NotFoundElement = NotFound_.element();

const InternalServerError_ = new InternalServerError({  });
const InternalServerErrorElement = InternalServerError_.element();

const LogIn_ = new LogIn({ fields: [
  { label: "Логин", inputType: "text", name: "login" },
  { label: "Пароль", inputType: "password", name: "password" },
]});
const LogInElement = LogIn_.element();

const SignUp_ = new SignUp({ fields: [
  { label: "Почта", inputType: "email", name: "email" },
  { label: "Логин", inputType: "text", name: "login" },
  { label: "Имя", inputType: "text", name: "second_name" },
  { label: "Фамилия", inputType: "text", name: "first_name" },
  { label: "Телефон", inputType: "tel", name: "phone" },
  { label: "Пароль", inputType: "password", name: "password" },
  { label: "Пароль (еще раз)", inputType: "password", name: "password_" },
]});
const SignUpElement = SignUp_.element();

export default class App {
  private state: {
    currentPage: string;
  };

  private appElement: HTMLElement;
  private eventUpdater: () => void;
  private UserProfile_: UserProfile;

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

    this.UserProfile_ = new UserProfile({ appElement: this.appElement, state: {noEdit: true, passwordEdit: false, dataEdit: false}, eventUpdater: this.eventUpdater, userProfileData});
  }

  render(): void {

    if (this.state.currentPage === "chatList") {
      this.appElement.innerHTML = "";
      this.appElement.appendChild(ChatListElement as Node);
    } else if (this.state.currentPage === "internalServerError") {
      this.appElement.innerHTML = "";
      this.appElement.appendChild(InternalServerErrorElement as Node);
    } else if (this.state.currentPage === "logIn") {
      this.appElement.innerHTML = "";
      this.appElement.appendChild(LogInElement as Node);
    } else if (this.state.currentPage === "notFound") {
      this.appElement.innerHTML = "";
      this.appElement.appendChild(NotFoundElement as Node);
    } else if (this.state.currentPage === "signUp") {
      this.appElement.innerHTML = "";
      this.appElement.appendChild(SignUpElement as Node);
    } else if (this.state.currentPage === "userProfile") {
      this.appElement.innerHTML = "";
      this.appElement.appendChild(this.UserProfile_.element() as Node);
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
