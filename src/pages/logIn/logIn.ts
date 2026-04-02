import Block from '../../framework/Block'
import {BlockOwnProps} from '../../framework/Block'

type Field = {
    label: string;
    inputType: string;
    name: string;
    errortext:string;
    content: string;
}

interface LogInProps extends BlockOwnProps{
    fields: Field[];
}

export default class LogIn extends Block<LogInProps> {
  static componentName = 'LogIn';

  protected template = `
    <div class="loginform">
    {{{ Auth title="Вход" fields=fields confirmButton="Авторизоваться" changeButton="Нет аккаунта?" changeLink="signUp" }}}
    {{{ Header }}}
</div>
  `;
}
