import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import validateForm from "../../utils/validate";
import { validateField } from "../../utils/validate";
import LoginController from "../../controllers/loginController.js";
import ProfileController from "../../controllers/profileController.js";
import Store from "../../framework/Store";
import isEqual from "../../utils/isEqual";

type Indexed<T = any> = {
    [key in string]: T;
};

type FieldName =
    | "first_name"
    | "second_name"
    | "login"
    | "email"
    | "password"
    | "phone"
    | "message";

type State = {
    noEdit: boolean;
    passwordEdit: boolean;
    dataEdit: boolean;
};

type Field = {
    label: string;
    inputType: string;
    name: string;
    errortext: string;
    content: string;
};

interface UserProfileProps extends BlockOwnProps {
    appElement: HTMLElement | null;
    state: State;
    name: string;
    avatarLink: string;
    fields: Field[];
    userInfo: Indexed<any>;
}

const userProfileData = [
    {
        label: "Почта",
        inputType: "",
        name: "email",
        errortext: "",
        content: "pochta@yandex.ru",
    },
    {
        label: "Логин",
        inputType: "",
        name: "login",
        errortext: "",
        content: "ivanivanov",
    },
    {
        label: "Имя",
        inputType: "",
        name: "second_name",
        errortext: "",
        content: "Иван",
    },
    {
        label: "Фамилия",
        inputType: "",
        name: "first_name",
        errortext: "",
        content: "Иванов",
    },
    {
        label: "Имя в чате",
        inputType: "",
        name: "display_name",
        errortext: "",
        content: "Иван",
    },
    {
        label: "Телефон",
        inputType: "",
        name: "phone",
        errortext: "",
        content: "8 800 000 00 00",
    },
];
const userInfoData = {
  "id": 0,
  "first_name": "",
  "second_name": "",
  "display_name": "",
  "phone": "",
  "login": "",
  "avatar": "",
  "email": ""
}

const default_props: UserProfileProps = {
            appElement: document.getElementById("app"),
            state: { noEdit: true, passwordEdit: false, dataEdit: false },
            name: "Иван",
            fields: userProfileData,
            userInfo: userInfoData,
            avatarLink: "",
        };

export default class UserProfile extends Block<UserProfileProps> {
    static componentName = "SignUp";
    private logincontroller = new LoginController();
    private profilecontroller = new ProfileController();

    constructor(props: UserProfileProps = default_props as UserProfileProps) {
        super(props);
        Store.setState("userInfo", this.props.userInfo);
        Store.setState("profileState", this.props.state);
        this.logincontroller.getUser();
        let state = this.mapStateToProps(Store.getState());
        Store.subscribe(() => {
          // при обновлении получаем новое состояние
          const newState = this.mapStateToProps(Store.getState());

          // если что-то из используемых данных поменялось, обновляем компонент
          if (!isEqual(state, newState)) {
            this.setProps({ ...newState as Indexed<any>});
          }

          // не забываем сохранить новое состояние
          state = newState;
        });
    }

    private mapStateToProps = (state: Indexed<any>) => {
        const new_fields = this.props.fields.map(field => {
            let res = structuredClone(field);
            for (const [key, value] of Object.entries(state.userInfo)) {
                if (field.name == key) {
                    res.content = value as string;
                }
            }
            return res;
        });
        console.log(state.profileState);
        return {
            userInfo: structuredClone(state.userInfo),
            fields: new_fields,
            avatarLink: "https://ya-praktikum.tech/api/v2/resources/"+state.userInfo.avatar,
            state: structuredClone(state.profileState),
        };
};

    protected events = {
        click: (event: Event) => {
            if (event.target == this.refs.logout) {
                this.logincontroller.logout();
            }
            if (event.target == this.refs.setDataEdit) {
                this.profilecontroller.profileState({
                    noEdit: false,
                    passwordEdit: false,
                    dataEdit: true,
                });
            }
            if (event.target == this.refs.setPasswordEdit) {
                this.profilecontroller.profileState({
                    noEdit: false,
                    passwordEdit: true,
                    dataEdit: false,
                });
            }
            if (event.target == this.refs.setNoEdit || event.target == this.refs.setNoEdit_) {
                this.profilecontroller.profileState({
                    noEdit: true,
                    passwordEdit: false,
                    dataEdit: false,
                });
            }
        },
        focusout: (event: Event) => {
            event.stopPropagation();
            if (this.props.state.dataEdit) {
                let error = validateField(
                    (event.target as HTMLInputElement).name,
                    (event.target as HTMLInputElement).value,
                );
                let tmp = [...this.props.fields];
                if (error) {
                    tmp.forEach((obj) => {
                        if (obj.name == (event.target as HTMLInputElement).name) {
                            obj.content = (event.target as HTMLInputElement).value;
                            obj.errortext = error;
                        }
                    });
                } else {
                    tmp.forEach((obj) => {
                        if (obj.name == (event.target as HTMLInputElement).name) {
                            obj.content = (event.target as HTMLInputElement).value;
                            obj.errortext = "";
                        }
                    });
                }
                this.setProps({ fields: tmp });
            }
            else if (this.props.state.passwordEdit) {
                //this.setProps();
            }
        },

        submit: (event: Event) => {
            event.preventDefault();

            const formData = new FormData(this.refs.form as HTMLFormElement);
            const validationErrors = validateForm(formData);
            if (Object.keys(validationErrors).length > 0) {
                let tmp = [...this.props.fields];
                tmp.forEach((obj) => {
                    if (validationErrors[obj.name as FieldName]) {
                        obj.errortext = validationErrors[
                            obj.name as FieldName
                        ] as string;
                    } else {
                        obj.errortext = "";
                    }
                });
                this.setProps({ fields: tmp });
                return;
            }
            let tmp = [...this.props.fields];
            tmp.forEach((obj: Field) => {
                obj.errortext = "";
            });
            this.setProps({ fields: tmp });

            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
        },
    };

    protected template = `
    {{#if state.noEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar"><img class="profile__avatarimg" src={{avatarLink}}></div>
            <div class="profile__name">{{userInfo.first_name}}</div>
        </div>
        <div class="profile__data">
            {{#each fields}}
            <div class="profile__line">
                <div class="profile__fieldname">{{this.label}}</div>
                <div class="profile__fieldvalue">{{this.content}}</div>
            </div>
            {{/each}}
        </div>
        <div class="profile__data">
            <div class="profile__line">{{{ Link href="#" class="profile__link setDataEdit" ref="setDataEdit" text="Изменить данные" }}}</div>
            <div class="profile__line">{{{ Link href="#" class="profile__link setPasswordEdit" ref="setPasswordEdit" text="Изменить пароль" }}}</div>
            <div class="profile__line">{{{ Link href="#" class="profile__link profile__link_red" text="Выйти" ref="logout"}}}</div>
        </div>
    </div>
</div>
{{/if}}
{{#if state.passwordEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar"><img class="profile__avatarimg" src={{avatarLink}}></div>
            <div class="profile__name">{{userInfo.first_name}}</div>
        </div>
        <form class="profile__data-wrap" ref="form">
            <div class="profile__data">
                <div class="profile__line">
                    <div class="profile__fieldname">Старый пароль</div>
                    <input class="profile__fieldvalue" type="password" id="old_password" name="old_password" ref="old_password">
                </div>
                <div class="profile__line">
                    <div class="profile__fieldname">Новый пароль</div>
                    <input class="profile__fieldvalue" type="password" id="new_password" name="new_password" ref="new_password">
                </div>
                <div class="profile__line">
                    <div class="profile__fieldname">Повторите пароль</div>
                    <input class="profile__fieldvalue" type="password" id="new_password_" name="new_password_" ref="new_password_">
                </div>
            </div>
            <div class="profile__data">
                <div class="profile__line"><button class="profile__link" type="submit">Сохранить</button></div>
                <div class="profile__line">{{{ Link href="#" class="profile__link profile__link_red setNoEdit" ref="setNoEdit" text="Отмена" }}}</div>
            </div>
        </form>
    </div>
</div>
{{/if}}
{{#if state.dataEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar profile__avatar_editable"><img class="profile__avatarimg" src={{avatarLink}}></div>
            <div class="profile__name">{{userInfo.first_name}}</div>
        </div>
        <form class="profile__data-wrap" ref="form">
            <div class="profile__data">
                {{#each fields}}
                <div class="profile__line">
                    <div class="profile__fieldname">{{this.label}}</div>
                    <input class="profile__fieldvalue" id="{{this.name}}" name="{{this.name}}" value="{{this.content}}" ref="{{this.name}}">
                </div>
                {{#if this.errortext}}<div class="profile__error">{{this.errortext}}</div>{{/if}}
                {{/each}}
            </div>
            <div class="profile__data">
                <div class="profile__line"><button class="profile__link" type="submit">Сохранить</button></div>
                <div class="profile__line">{{{ Link href="#" class="profile__link profile__link_red setNoEdit" ref="setNoEdit_" text="Отмена" }}}</div>
            </div>
        </form>
    </div>
</div>
{{/if}}
  `;
}
