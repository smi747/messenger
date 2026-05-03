import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";

type Field = {
    label: string;
    inputType: string;
    name: string;
    errortext: string;
    content: string;
};

interface SignUpProps extends BlockOwnProps {
    fields: Field[];
}

const fields = {
    fields: [
        {
            label: "Почта",
            inputType: "email",
            name: "email",
            errortext: "",
            content: "",
        },
        {
            label: "Логин",
            inputType: "text",
            name: "login",
            errortext: "",
            content: "",
        },
        {
            label: "Имя",
            inputType: "text",
            name: "second_name",
            errortext: "",
            content: "",
        },
        {
            label: "Фамилия",
            inputType: "text",
            name: "first_name",
            errortext: "",
            content: "",
        },
        {
            label: "Телефон",
            inputType: "tel",
            name: "phone",
            errortext: "",
            content: "",
        },
        {
            label: "Пароль",
            inputType: "password",
            name: "password",
            errortext: "",
            content: "",
        },
        {
            label: "Пароль (еще раз)",
            inputType: "password",
            name: "password_",
            errortext: "",
            content: "",
        },
    ],
};

export default class SignUp extends Block<SignUpProps> {
    static componentName = "SignUp";

    constructor(props: SignUpProps = fields as SignUpProps) {
        super(props);
    }

    protected template = `
    <div class="loginform">
    {{{ Auth title="Регистрация" fields=fields confirmButton="Зарегистрироваться" changeButton="Войти" swap="/"}}}
{{{ Header }}}
 </div>
  `;
}
