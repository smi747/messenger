import UsersAPI from "../api/users";
import Store from "../framework/Store";
import Router from "../router";

const profileAPI = new UsersAPI();

export default class ProfileController {
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
    async setPassword(data) {
        const oldPw = data.oldPassword;
        const newPw = data.newPassword;
        const newPw_ = data.newPassword_;
        if (newPw != newPw_) {
            Store.setState('formError', "Пароли не совпадают!");
            return;
        }
        try {
            const result = await profileAPI.setPassword(data);
            if (result == "OK") {
                Store.setState('formError', "Пароль успешно изменен!");
            }
        } catch (error) {
            Store.setState('formError', JSON.parse(error.response).reason);
        }
    }
    async setAvatar(data) {
        try {
            const result = await profileAPI.setAvatar(data);
            if (result.id) {
                Store.setState('userInfo', result);
                Store.setState("profileState", { noEdit: true, passwordEdit: false, dataEdit: false });
        }
        }
        catch (error) {
            Store.setState('formError', JSON.parse(error.response).reason);
        }
    }

  profileState(n) {
    Store.setState("profileState", n);
  }
}
