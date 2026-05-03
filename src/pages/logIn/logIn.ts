import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";

type Field = {
    label: string;
    inputType: string;
    name: string;
    errortext: string;
    content: string;
};

interface LogInProps extends BlockOwnProps {
    fields: Field[];
}

const fields = {fields: [
        {
            label: "Логин",
            inputType: "text",
            name: "login",
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
    ]};

export default class LogIn extends Block<LogInProps> {
    static componentName = "LogIn";

    constructor(props: LogInProps = fields as LogInProps) {
        super(props);
    }

    protected template = `
    <div class="loginform">
    {{{ Auth title="Вход" fields=fields confirmButton="Авторизоваться" changeButton="Нет аккаунта?" changeLink="signUp" swap="/sign-up"}}}
    {{{ Header }}}
</div>
  `;
}
