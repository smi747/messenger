import AuthAPI from "../api/auth";
import Router from "../router";

const loginAPI = new AuthAPI();

export default class LoginController {
    async login(data) {
    try {

      console.log(12345);

      //const userID = loginAPI.request(prepareDataToRequest(data));

      Router.go('/messenger');

    } catch (error) {
      // Логика обработки ошибок
    }
  }
}
