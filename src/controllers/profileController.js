import UsersAPI from "../api/users";
import Store from "../framework/Store";
import Router from "../router";

const profileAPI = new UsersAPI();

export default class LoginController {
    async setProfile(data) {
    try {
      const result = await profileAPI.setProfile(data);
      if (result.id) {
        Store.setState('userInfo', result);
      }
    } catch (error) {
        Router.go('/500');
    }
  }
}
