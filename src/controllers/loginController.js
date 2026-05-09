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
        Store.setState('userInfo', result);
      }
    } catch (error) {
      Store.setState('loginError', JSON.parse(error.response).reason);
    }
  }

  async logout() {
    try {
      const result = await loginAPI.logout();
      if (result == "OK") {
        Router.go('/');
      }
    } catch (error) {
      Router.go('/');
    }
  }

    async signup(data) {
        try {
        const result = await loginAPI.signup(data);
        if (result.id) {
            Store.setState('userInfo', result);
            Router.go('/messenger');
        }
        } catch (error) {
            Store.setState('loginError', JSON.parse(error.response).reason);
        }
    }

        async getUser() {
        try {
        const result = await loginAPI.getUser();
        if (result.id) {
            Store.setState('userInfo', result);
        }
        } catch (error) {
            Store.setState('loginError', JSON.parse(error.response).reason);
        }
    }
}
