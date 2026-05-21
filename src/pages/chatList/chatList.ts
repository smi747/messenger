import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import ChatlistController from "../../controllers/chatlistController";
import Store from "../../framework/Store";
import isEqual from "../../utils/isEqual";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Indexed<T = any> = {
    [key in string]: T;
};

type AddChatRequest = {
    title: string;
};

type DeleteChatRequest = {
    chatId: number;
};

type UserRequest = {
    users: number[];
    chatId: number;
};

type Message = {
    my: string;
    content: string;
    time: string;
};

type User = {
    "id": number,
    "first_name": string,
    "second_name": string,
    "display_name": string,
    "login": string,
    "avatar": string,
    "role": string
};

type Users ={
    users: User[];
}

type Chat = {
    id: number;
    title: string;
    avatar: string;
    created_by: number;
    unread_count: number;
    last_message: string;
};

interface ChatListProps extends BlockOwnProps {
    messages: Message[];
    chats: Chat[];
    current: Chat;
    activeModal: boolean;
    activeModalSettings: boolean;
    activeModalAvatar: boolean;
    avatarError: string;
    users: Users;
}

export default class ChatList extends Block<ChatListProps> {
    static componentName = "ChatList";
    private chatlistcontroller = new ChatlistController();

    constructor() {
        super();
        Store.setState("chatList", this.props.chats);
        Store.setState("current", null);
        Store.setState("users", null);
        this.chatlistcontroller.getChats();

        let state = this.mapStateToProps(Store.getState());
        Store.subscribe(() => {
            // при обновлении получаем новое состояние
            const newState = this.mapStateToProps(Store.getState());

            // если что-то из используемых данных поменялось, обновляем компонент
            if (!isEqual(state, newState)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.setProps({ ...(newState as Indexed<any>) });
            }

            // не забываем сохранить новое состояние
            state = newState;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapStateToProps = (state: Indexed<any>) => {
        return {
            chats: state.chatList,
            current: structuredClone(state.current),
            users: state.users,
        };
    };

    protected events = {
        click: (event: Event) => {
            if (event.target == this.refs.changeavatar) {
                this.setProps({ activeModalSettings: false });
                this.setProps({ activeModalAvatar: true });
            }
            if (event.target == this.refs.background) {
                this.setProps({
                    activeModal: false,
                    activeModalSettings: false,
                    activeModalAvatar: false,
                });
            }
            if (event.target == this.refs.newchat) {
                this.setProps({ activeModal: true });
            }
            if (event.target == this.refs.chatsettings) {
                this.chatlistcontroller.getUsers(String(this.props.current.id));
                this.setProps({ activeModalSettings: true });
            }
        },
        submit: (event: Event) => {
            event.preventDefault();
            if (this.props.activeModal) {
                const formData = new FormData(
                    this.refs.formnewchat as HTMLFormElement,
                );
                const data: AddChatRequest = { title: "" };
                data.title = formData.get("title") as string;
                this.chatlistcontroller.addChat(data as AddChatRequest);
                this.setProps({ activeModal: false });
            }
            if (this.props.activeModalSettings) {
                const formData = new FormData(
                    this.refs.formchatsettings as HTMLFormElement,
                );
                const data = {
                    users: [Number(formData.get("user"))],
                    chatId: this.props.current.id,
                };
                const submitter = (event as SubmitEvent).submitter;
                if (submitter) {
                    if ((submitter as HTMLInputElement).value == "add") {
                        this.chatlistcontroller.addUser(data as UserRequest);
                    } else if (
                        (submitter as HTMLInputElement).value == "remove"
                    ) {
                        this.chatlistcontroller.deleteUser(data as UserRequest);
                    } else if (
                        (submitter as HTMLInputElement).value == "remove_chat"
                    ) {
                        this.chatlistcontroller.deleteChat({chatId: this.props.current.id} as DeleteChatRequest);
                    }
                    this.setProps({ activeModalSettings: false });
                }
            }
            if (this.props.activeModalAvatar) {
                const formData = new FormData(
                    this.refs.formavatar as HTMLFormElement,
                );
                formData.append("chatId", String(this.props.current.id));

                const avatar = formData.get("avatar");
                if (!(avatar as File)["size"]) {
                    this.setProps({ avatarError: "Пустой файл" });
                } else {

                    this.chatlistcontroller.setAvatar(formData);
                    this.setProps({ avatarError: "" });
                    this.setProps({ activeModalAvatar: false });
                }
            }
        },
    };

    protected template = `
    <div class="chatlist">
    <div class="chatlist__catalog catalog">
        <div class="catalog__functions">
            <button class="catalog__button" ref="newchat">Новый чат</button>
            {{{ Link class="catalog__button" href="/settings" text="Профиль"}}}
        </div>
        <div class="catalog__search">
            <input class="catalog__input" placeholder="Поиск">
        </div>
        <div class="catalog__list">
            {{#each chats}}
                {{{ Chat name=this.title content=this.last_message time=this.last_message.time indicator=this.unread_count id=this.id avatar=this.avatar}}}
            {{/each}}
        </div>
    </div>
    <div class="chatlist__chat chat">
        <div class="chat__top">
        {{#if current}}
            <div class="chat__info">
                <div class="chat__avatar">{{#if current.avatar}}<img class="chat__avatarimg" src="https://ya-praktikum.tech/api/v2/resources/{{current.avatar}}">{{/if}}</div>
                <div class="chat__name">{{current.name}}</div>
            </div>
            <button class="chat__functions" ref="chatsettings">
                <div class="chat__dot"></div>
                <div class="chat__dot"></div>
                <div class="chat__dot"></div>
            </button>
        {{/if}}
        </div>
        <div class="chat__content">
             {{#each messages}}
                {{{ Message content=this.content time=this.time my=this.my }}}
             {{/each}}
        </div>
        <form class="chat__bottom" ref="form">
        {{#if current}}
            <input class="catalog__input" placeholder="Сообщение" name="message">
            <button type="submit" class="catalog__send">→</button>
        {{/if}}
        </form>
        {{#if activeModal}}
    <div class="chat__background" ref="background">
        <div class="newchat">
    <div class="newchat__title">Новый чат</div>
    <form class="newchat__form" ref="formnewchat">
                <div class="newchat__line">
                    <div class="newchat__fieldname">Название</div>
                    <input class="newchat__fieldvalue" name="title" placeholder="Новый чат">
                </div>
        <div class="newchat__buttons">
            <button type="submit" class="newchat__confirm">Создать</button>
        </div>
    </form>
    </div>
    </div>
    {{/if}}
    {{#if activeModalAvatar}}
    <div class="chat__background" ref="background">
        <div class="avatar">
    <div class="avatar__title">Загрузите файл</div>
    <form class="avatar__form" ref="formavatar">
        <input type="file" id="imageLoader" name="avatar" accept="image/*" class="avatar__input">
        <div class="avatar__buttons">
            <button type="submit" class="avatar__confirm">Поменять</button>
            <div class="avatar__error avatar__error_centered">{{avatarError}}</div>
        </div>
    </form>
    </div>
    </div>
    {{/if}}
    {{#if activeModalSettings}}
    <div class="chat__background" ref="background">
        <div class="newchat">
    <div class="newchat__title">Настройки чата</div>
    <form class="newchat__form" ref="formchatsettings">
        <div class="newchat__avatar newchat__avatar_editable" ref="changeavatar">{{#if current.avatar}}<img class="newchat__avatarimg" src="https://ya-praktikum.tech/api/v2/resources/{{current.avatar}}">{{/if}}</div>
                <div class="newchat__line">
                    <div class="newchat__fieldname">ID пользователя</div>
                    <input class="newchat__fieldvalue" list="userlist" name="user" autocomplete="off" placeholder="1234">
                    <datalist id="userlist">
                    {{#each users}}
                    <option value="{{this.id}}" >{{this.first_name}}</option>{{/each}}
                    </datalist>
                </div>
        <div class="newchat__buttons">
            <button type="submit" class="newchat__confirm" value="add">Добавить пользователя</button>
            <button type="submit" class="newchat__confirm newchat__confirm_red" value="remove">Удалить пользователя</button>
        </div>
        <button type="submit" class="newchat__confirm newchat__confirm_red" value="remove_chat">Удалить чат</button>
    </form>
    </div>
    </div>
    {{/if}}
    </div>
</div>
  `;
}
