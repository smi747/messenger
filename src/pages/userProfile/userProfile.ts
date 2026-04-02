import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import validateForm from "../../utils/validate";
import {validateField} from "../../utils/validate";

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
    errortext:string;
    content:string;
};

interface UserProfileProps extends BlockOwnProps {
    appElement: HTMLElement | null;
    state: State;
    eventUpdater: () => void;
    name: string;
    fields: Field[];
}

export default class UserProfile extends Block<UserProfileProps> {
    static componentName = "SignUp";

    protected events = {
        focusout: (event: Event) => {
            event.stopPropagation();
                let error = validateField((event.target as HTMLInputElement).name, (event.target as HTMLInputElement).value);
                let tmp = [...this.props.fields];
                if (error) {
                    tmp.forEach((obj) => {
                        if (obj.name == (event.target as HTMLInputElement).name) {
                            obj.content = (event.target as HTMLInputElement).value;
                            obj.errortext = error;
                        }
                    });
                }
                else {
                    tmp.forEach((obj) => {
                        if (obj.name == (event.target as HTMLInputElement).name) {
                            obj.content = (event.target as HTMLInputElement).value;
                            obj.errortext = "";
                        }
                    });
                }
                this.setProps({fields: tmp});
        },

        submit: (event: Event) => {
            event.preventDefault();

            const formData = new FormData(this.refs.form as HTMLFormElement);
            const validationErrors = validateForm(formData);
            if (Object.keys(validationErrors).length > 0) {
                let tmp = [...this.props.fields];
                tmp.forEach((obj) => {
                    if (validationErrors[obj.name as FieldName]) {
                        obj.errortext=validationErrors[obj.name as FieldName] as string;
                    } else {
                        obj.errortext="";
                    }
                });
                this.setProps({ fields: tmp});
                return;
            }
            let tmp = [...this.props.fields];
            tmp.forEach((obj:Field) => {
                obj.errortext="";
            });
            this.setProps({ fields: tmp});

            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
        },
    };

    protected componentDidMount(): void {
        Object.entries(this.refs).forEach(([name, link]) => {
            if (name == "setPasswordEdit") {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.setProps({
                        state: {
                            noEdit: false,
                            passwordEdit: true,
                            dataEdit: false,
                        },
                    });
                });
            }
            if (name == "setDataEdit") {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.setProps({
                        state: {
                            noEdit: false,
                            passwordEdit: false,
                            dataEdit: true,
                        },
                    });
                });
            }
            if (name == "setNoEdit" || name == "setNoEdit_") {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.setProps({
                        state: {
                            noEdit: true,
                            passwordEdit: false,
                            dataEdit: false,
                        },
                    });
                });
            }
        });
        this.props.eventUpdater();
    }

    protected template = `
    {{#if state.noEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar profile__avatar_editable"></div>
            <div class="profile__name">{{name}}</div>
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
            <div class="profile__line">{{{ Link href="#" class="profile__link profile__link_red" text="Выйти" }}}</div>
        </div>
    </div>
{{{ Header }}}
</div>
{{/if}}
{{#if state.passwordEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar"></div>
            <div class="profile__name">{{name}}</div>
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
{{{ Header }}}
</div>
{{/if}}
{{#if state.dataEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar"></div>
            <div class="profile__name">{{name}}</div>
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
{{{ Header }}}
</div>
{{/if}}
  `;
}
