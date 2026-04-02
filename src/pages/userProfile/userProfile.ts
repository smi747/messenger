import Block from '../../framework/Block'
import {BlockOwnProps} from '../../framework/Block'

type State = {
    noEdit:boolean;
    passwordEdit:boolean;
    dataEdit:boolean;
}

type DataString = {
    name:string;
    value:string;
    name_:string;
}

type UserProfileData = {
    name: string;
    data:DataString[];
}

interface UserProfileProps extends BlockOwnProps{
    appElement:HTMLElement | null;
    state:State;
    eventUpdater: (() => void);
    userProfileData: UserProfileData;
}

export default class UserProfile extends Block<UserProfileProps> {
  static componentName = 'SignUp';

  protected componentDidMount(): void {
      Object.entries(this.refs).forEach(([name, link]) => {
        if (name == "setPasswordEdit") {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                this.setProps({state: { noEdit: false, passwordEdit: true, dataEdit: false }});
            });
        };
        if (name == "setDataEdit") {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                this.setProps({state: { noEdit: false, passwordEdit: false, dataEdit: true }});
            });
        };
        if (name == "setNoEdit" || name == "setNoEdit_") {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                this.setProps({state: { noEdit: true, passwordEdit: false, dataEdit: false }});
            });
        };
    });
    this.props.eventUpdater();
  }

  protected template = `
    {{#if state.noEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar profile__avatar_editable"></div>
            <div class="profile__name">{{userProfileData.name}}</div>
        </div>
        <div class="profile__data">
            {{#each userProfileData.data}}
            <div class="profile__line">
                <div class="profile__fieldname">{{this.name}}</div>
                <div class="profile__fieldvalue">{{this.value}}</div>
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
            <div class="profile__name">{{userProfileData.name}}</div>
        </div>
        <div class="profile__data">
            <div class="profile__line">
                <div class="profile__fieldname">Старый пароль</div>
                <input class="profile__fieldvalue" type="password" id="old_password" name="old_password">
            </div>
            <div class="profile__line">
                <div class="profile__fieldname">Новый пароль</div>
                <input class="profile__fieldvalue" type="password" id="new_password" name="new_password">
            </div>
            <div class="profile__line">
                <div class="profile__fieldname">Повторите пароль</div>
                <input class="profile__fieldvalue" type="password" id="new_password_" name="new_password_">
            </div>
        </div>
        <div class="profile__data">
            <div class="profile__line">{{{ Link href="#" class="profile__link" text="Сохранить" }}}</div>
            <div class="profile__line">{{{ Link href="#" class="profile__link profile__link_red setNoEdit" ref="setNoEdit" text="Отмена" }}}</div>
        </div>
    </div>
{{{ Header }}}
</div>
{{/if}}
{{#if state.dataEdit}}
<div class="profile">
    <div class="profile__content">
        <div class="profile__person">
            <div class="profile__avatar"></div>
            <div class="profile__name">{{userProfileData.name}}</div>
        </div>
        <div class="profile__data">
            {{#each userProfileData.data}}
            <div class="profile__line">
                <div class="profile__fieldname">{{this.name}}</div>
                <input class="profile__fieldvalue" id="{{this.name_}}" name="{{this.name_}}" value="{{this.value}}">
            </div>
            {{/each}}
        </div>
        <div class="profile__data">
            <div class="profile__line">{{{ Link href="#" class="profile__link" text="Сохранить" }}}</div>
            <div class="profile__line">{{{ Link href="#" class="profile__link profile__link_red setNoEdit" ref="setNoEdit_" text="Отмена" }}}</div>
        </div>
    </div>
{{{ Header }}}
</div>
{{/if}}
  `;
}
