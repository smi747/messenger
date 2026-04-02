import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";

type Field = {
    label: string;
    inputType: string;
    name:string;
    errortext:string;
    content: string;
};

interface SignUpProps extends BlockOwnProps {
    fields: Field[];
}

export default class SignUp extends Block<SignUpProps> {
    static componentName = "SignUp";

    protected template = `
    <div class="loginform">
    {{{ Auth title="Регистраиця" fields=fields confirmButton="Зарегистрироваться" changeButton="Войти" changeLink="logIn" }}}
{{{ Header }}}
 </div>
  `;
}
