import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import validateForm from "../../utils/validate";
import { validateField } from "../../utils/validate";
import LoginController from "../../controllers/loginController.js";
import ProfileController from "../../controllers/profileController.js";
import Store from "../../framework/Store";
import isEqual from "../../utils/isEqual";

type User = {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    avatar: string;
    email: string;
    phone: string;
};

type Indexed<T = unknown> = {
    [key in string]: T;
} & {userInfo: User;
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

type PasswordData = {
    oldPassword: string;
    newPassword: string;
    newPassword_: string;
};

interface UserProfileProps extends BlockOwnProps {
    appElement: HTMLElement | null;
    state: State;
    name: string;
    avatarLink: string;
    fields: Field[];
    userInfo: typeof userInfoData;
    formError: string;
    activeModal: boolean;
    loginError: string;
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

const passwordData = [
    {
        label: "Старый пароль",
        inputType: "password",
        name: "oldPassword",
        errortext: "",
        content: "",
    },
    {
        label: "Новый пароль",
        inputType: "password",
        name: "newPassword",
        errortext: "",
        content: "",
    },
    {
        label: "Повторите пароль",
        inputType: "password",
        name: "newPassword_",
        errortext: "",
        content: "",
    },
];

const userInfoData = {
    id: 0,
    first_name: "",
    second_name: "",
    display_name: "",
    phone: "",
    login: "",
    avatar: "",
    email: "",
};

const default_props: UserProfileProps = {
    appElement: document.getElementById("app"),
    state: { noEdit: true, passwordEdit: false, dataEdit: false },
    name: "Иван",
    fields: userProfileData,
    userInfo: userInfoData,
    avatarLink: "",
    formError: "",
    activeModal: false,
    loginError: "",
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
        let state = this.mapStateToProps(Store.getState() as Indexed<unknown>);
        Store.subscribe(() => {
            // при обновлении получаем новое состояние
            const newState = this.mapStateToProps(Store.getState() as Indexed<unknown>);

            // если что-то из используемых данных поменялось, обновляем компонент
            if (!isEqual(state, newState)) {
                this.setProps({ ...(newState as Indexed<unknown>) });
            }

            // не забываем сохранить новое состояние
            state = newState;
        });
    }
    private mapStateToProps = (state: Indexed<unknown>) => {
        const new_fields = this.props.fields.map((field) => {
            let res = structuredClone(field);
            for (const [key, value] of Object.entries(state.userInfo)) {
                if (field.name == key) {
                    res.content = value as string;
                }
            }
            return res;
        });
        return {
            userInfo: structuredClone(state.userInfo),
            fields: new_fields,
            avatarLink:
                "https://ya-praktikum.tech/api/v2/resources/" +
                state.userInfo.avatar,
            state: structuredClone(state.profileState),
            formError: state.formError,
        };
    };

    protected events = {
        click: (event: Event) => {
            if (event.target == this.refs.background) {
                this.setProps({ activeModal: false });
            }
            if (event.target == this.refs.changeavatar) {
                this.setProps({ activeModal: true });
            }
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
                this.props.fields = passwordData;
                this.profilecontroller.profileState({
                    noEdit: false,
                    passwordEdit: true,
                    dataEdit: false,
                });
            }
            if (
                event.target == this.refs.setNoEdit ||
                event.target == this.refs.setNoEdit_
            ) {
                this.props.fields = userProfileData;
                this.profilecontroller.profileState({
                    noEdit: true,
                    passwordEdit: false,
                    dataEdit: false,
                });
            }
        },
        focusout: (event: Event) => {
            event.stopPropagation();
            if (this.props.state.dataEdit && !this.props.activeModal) {
                let error = validateField(
                    (event.target as HTMLInputElement).name,
                    (event.target as HTMLInputElement).value,
                );
                let tmp = structuredClone(this.props.fields);
                if (error) {
                    tmp.forEach((obj) => {
                        if (
                            obj.name == (event.target as HTMLInputElement).name
                        ) {
                            obj.content = (
                                event.target as HTMLInputElement
                            ).value;
                            obj.errortext = error;
                        }
                    });
                } else {
                    tmp.forEach((obj) => {
                        if (
                            obj.name == (event.target as HTMLInputElement).name
                        ) {
                            obj.content = (
                                event.target as HTMLInputElement
                            ).value;
                            obj.errortext = "";
                        }
                    });
                }
                this.setProps({ fields: tmp });
            }
        },

        submit: (event: Event) => {
            event.preventDefault();
            if (this.props.state.dataEdit && this.props.activeModal) {
                const formData = new FormData(
                    this.refs.formavatar as HTMLFormElement,
                );

                const avatar = formData.get("avatar");
                if (!(avatar as File)["size"]) {
                    this.setProps({ loginError: "Пустой файл" });
                } else {
                    this.profilecontroller.setAvatar(formData);
                    this.setProps({ loginError: "" });
                    this.setProps({ activeModal: false });
                }
            }

            if (this.props.state.dataEdit && !this.props.activeModal) {
                const formData = new FormData(
                    this.refs.form as HTMLFormElement,
                );
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
                const data: { [key: string]: FormDataEntryValue } = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }

                this.profilecontroller.setProfile(data);
                this.profilecontroller.profileState({
                    noEdit: true,
                    passwordEdit: false,
                    dataEdit: false,
                });
            }
            if (this.props.state.passwordEdit) {
                const formData = new FormData(
                    this.refs.form as HTMLFormElement,
                );
                const data: { [key: string]: string } = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value as string;
                }

                this.profilecontroller.setPassword(data as PasswordData);
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
            <div class="profile__line"><button class="profile__link setDataEdit" ref="setDataEdit">Изменить данные</button></div>
            <div class="profile__line"><button class="profile__link setPasswordEdit" ref="setPasswordEdit">Изменить пароль</button></div>
            <div class="profile__line"><button class="profile__link profile__link_red" ref="logout">Выйти</button></div>
            <div class="profile__line">{{{ Link href="/messenger" class="profile__link" text="Вернуться"}}}</div>
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
                {{#each fields}}
                <div class="profile__line">
                    <div class="profile__fieldname">{{this.label}}</div>
                    <input class="profile__fieldvalue" type="{{this.inputType}}" id="{{this.name}}" name="{{this.name}}" ref="{{this.name}}" value="{{this.content}}">
                </div>
                {{#if this.errortext}}<div class="profile__error">{{this.errortext}}</div>{{/if}}
                {{/each}}
            </div>
            <div class="profile__data">
                <div class="profile__error profile__error_centered">{{formError}}</div>
                <div class="profile__line"><button class="profile__link" type="submit">Сохранить</button></div>
                <div class="profile__line"><button class="profile__link profile__link_red setNoEdit" ref="setNoEdit">Отмена</button></div>
            </div>
        </form>
    </div>
</div>
{{/if}}
{{#if state.dataEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar profile__avatar_editable" ref="changeavatar"><img class="profile__avatarimg" src={{avatarLink}}></div>
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
                <div class="profile__line"><button class="profile__link profile__link_red setNoEdit" ref="setNoEdit_">Отмена</button></div>
            </div>
        </form>
    </div>
    {{#if activeModal}}
    <div class="profile__background" ref="background">
        <div class="avatar">
    <div class="avatar__title">Загрузите файл</div>
    <form class="avatar__form" ref="formavatar">
        <input type="file" id="imageLoader" name="avatar" accept="image/*" class="avatar__input">
        <div class="avatar__buttons">
            <button type="submit" class="avatar__confirm">Поменять</button>
            <div class="avatar__error avatar__error_centered">{{loginError}}</div>
        </div>
    </form>
    </div>
    </div>
    {{/if}}
</div>
{{/if}}
  `;
}
