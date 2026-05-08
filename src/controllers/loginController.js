import AuthAPI from "../api/auth";
import Store from "../framework/Store";
import Router from "../router";

const loginAPI = new AuthAPI();

export default class LoginController {
    async login(data) {
    try {

      const result = await loginAPI.signin(data);
      if (result == "OK") {
        Router.go('/messenger');
      }

      //.then(data => Store.set('user', data));

      //Router.go('/messenger');

    } catch (error) {
      Store.setState('loginError', "Ошибка входа: проверьте логин или пароль");
    }
  }
}
