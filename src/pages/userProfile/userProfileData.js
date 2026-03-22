import Handlebars from "handlebars";
import userPrfile_ from "./userProfile.hbs?raw";

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

export default class userProfile {
  constructor(appElement, eventUpdater) {
    this.appElement = appElement;
    this.state = { noEdit: true, passwordEdit: false, dataEdit: false };
    this.eventUpdater = eventUpdater;
  }

  render() {
    const compiledTemplate = Handlebars.compile(userPrfile_)({
      userProfileData: userProfileData,
      state: this.state,
    });
    this.appElement.innerHTML = compiledTemplate;
    this.attachEventListeners();
  }

  attachEventListeners() {
    let selected = document.querySelectorAll(".setNoEdit");
    selected.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.state = { noEdit: true, passwordEdit: false, dataEdit: false };
        this.render();
      });
    });
    selected = document.querySelectorAll(".setPasswordEdit");
    selected.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.state = { noEdit: false, passwordEdit: true, dataEdit: false };
        this.render();
      });
    });
    selected = document.querySelectorAll(".setDataEdit");
    selected.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.state = { noEdit: false, passwordEdit: false, dataEdit: true };
        this.render();
      });
    });
    this.eventUpdater();
  }
}
