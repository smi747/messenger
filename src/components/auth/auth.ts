import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import validateForm from "../../utils/validate";
import { validateField } from "../../utils/validate";
import LoginController from "../../controllers/loginController.js";
import Store from "../../framework/Store";

type FieldName =
    | "first_name"
    | "second_name"
    | "login"
    | "email"
    | "password"
    | "phone"
    | "message";

type Errors = Partial<Record<FieldName, string>>;

type SignupData = {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
};

type SigninData = {
    login: string;
    password: string;
};

type Field = {
    label: string;
    inputType: string;
    name: string;
    errortext: string;
    content: string;
};

interface AuthProps extends BlockOwnProps {
    title: string;
    confirmButton: string;
    changeButton: string;
    fields: Field[];
    errors: Errors;
    type: string;
    loginError: string;
}

export default class Auth extends Block<AuthProps> {
    static componentName = "Auth";
    private logincontroller = new LoginController();

    constructor(props: AuthProps) {
        super(props);
        Store.subscribe(() => {
            // вызываем обновление компонента, передав данные из хранилища
            this.setProps({ ...Store.getState() });
        });
    }

    protected events = {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: { [key: string]: any } = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            if (this.props.type == "LogIn") {
                this.logincontroller.login(data as SigninData);
            }
            if (this.props.type == "SignUp") {
                this.logincontroller.signup(data as SignupData);
            }
        },

        focusout: (event: Event) => {
            event.stopPropagation();
            if (
                (event as FocusEvent).relatedTarget instanceof HTMLAnchorElement
            ) {
                return;
            }
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
        },
    };

    protected template = `
    <div class="auth">
    <div class="auth__title">{{title}}</div>
    <form class="auth__form" ref="form">
        <div class="auth__inputfields">
        {{#each fields}}
            <div class="auth__inputfield">
                <label class="auth__label" for="{{this.name}}">{{this.label}}</label>
                <input class="auth__input" id="{{this.name}}" name="{{this.name}}" ref="{{this.name}}" type="{{this.inputType}}" value="{{this.content}}">
             </div><div class="auth__error">{{#if this.errortext }}{{ this.errortext }}{{/if}}</div>
        {{/each}}
        </div>
        <div class="auth__buttons">
            <button type="submit" class="auth__confirm">{{confirmButton}}</button>
            <div class="auth__change">{{{ Link href=swap class="auth__link" text=changeButton }}}</div>
            <div class="auth__error auth__error_centered">{{loginError}}</div>
        </div>
    </form>
</div>
  `;
}
