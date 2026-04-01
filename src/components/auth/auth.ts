import Block from '../../framework/Block'
import {BlockOwnProps} from '../../framework/Block'

type Field = {
    label: string;
    inputType: string;
    name: string;
}

interface AuthProps extends BlockOwnProps{
    title:string;
    confirmButton:string;
    changeButton: string;
    fields: Field[];
}

export default class Auth extends Block<AuthProps> {
  static componentName = 'Auth';

  protected template = `
    <div class="auth">
    <div class="auth__title">{{title}}</div>
    <form class="auth__form">
        <div class="auth__inputfields">
        {{#each fields}}
            <div class="auth__inputfield">
                <label class="auth__label" for="{{this.name}}">{{this.label}}</label>
                <input class="auth__input" id="{{this.name}}" name="{{this.name}}" type="{{this.inputType}}">
            </div>
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
