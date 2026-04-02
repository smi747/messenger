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

type Errors = Partial<Record<FieldName, string>>;

type Field = {
    label: string;
    inputType: string;
    name: string;
    errortext:string;
    content:string;
};

interface AuthProps extends BlockOwnProps {
    title: string;
    confirmButton: string;
    changeButton: string;
    fields: Field[];
    errors: Errors;
}

export default class Auth extends Block<AuthProps> {
    static componentName = "Auth";

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
            <div class="auth__change">{{{ Link href="#" class="auth__link" data-page=changeLink text=changeButton }}}</div>
        </div>
    </form>
</div>
  `;
}
