import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import ChatlistController from "../../controllers/chatlistController.js";
import Store from "../../framework/Store";
import isEqual from "../../utils/isEqual";

type Indexed<T = any> = {
    [key in string]: T;
};

type AddChatRequest = {
  title: string;
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

// type ChatOld = {
//     name: string;
//     content: string;
//     time: string;
//     indicator: string;
// };

type Chat = {
    id: number;
    title: string;
    avatar: string;
    created_by: number;
    unread_count: number;
    last_message: string;
}

interface ChatListProps extends BlockOwnProps {
    messages: Message[];
    chats: Chat[];
    current: Chat;
    activeModal: boolean;
    activeModalSettings: boolean;
}

export default class ChatList extends Block<ChatListProps> {
    static componentName = "ChatList";
    private chatlistcontroller = new ChatlistController();

    constructor(props: ChatListProps) {
        super(props);
        Store.setState("chatList", this.props.chats);
        Store.setState("current", null);
        this.chatlistcontroller.getChats();

        let state = this.mapStateToProps(Store.getState());
        Store.subscribe(() => {
          // при обновлении получаем новое состояние
          const newState = this.mapStateToProps(Store.getState());

          // если что-то из используемых данных поменялось, обновляем компонент
          if (!isEqual(state, newState)) {
            this.setProps({ ...newState as Indexed<any>});
          }

          // не забываем сохранить новое состояние
          state = newState;
        });
    }

    private mapStateToProps = (state: Indexed<any>) => {
        return {
            chats: state.chatList,
            current: structuredClone(state.current),
        };
    };

    protected events = {
        click: (event: Event) => {
            if (event.target == this.refs.background) {
                this.setProps({ activeModal: false, activeModalSettings: false });
            }
            if (event.target == this.refs.newchat) {
                this.setProps({ activeModal: true });
            }
            if (event.target == this.refs.chatsettings) {
                this.setProps({ activeModalSettings: true });
            }
        },
        submit: (event: Event) => {
            event.preventDefault();
            if (this.props.activeModal) {
                const formData = new FormData(this.refs.formnewchat as HTMLFormElement);
                const data: AddChatRequest = {title: ""};
                data.title = formData.get("title") as string;
                this.chatlistcontroller.addChat(data as AddChatRequest);
                    this.setProps({ activeModal: false});
            }
            if (this.props.activeModalSettings) {
                const formData = new FormData(this.refs.formchatsettings as HTMLFormElement);
                const data = {"users": [Number(formData.get("user"))], chatId: this.props.current.id};
                const submitter = (event as SubmitEvent).submitter;
                if (submitter) {
                    if ((submitter as HTMLInputElement).value == "add") {
                        this.chatlistcontroller.addUser(data as UserRequest);
                    }
                    else if ((submitter as HTMLInputElement).value == "remove") {
                        this.chatlistcontroller.deleteUser(data as UserRequest);
                    }
                    this.setProps({ activeModalSettings: false});
                }
            }
        }
    }

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
                {{{ Chat name=this.title content=this.last_message time=this.last_message.time indicator=this.unread_count id=this.id}}}
            {{/each}}
        </div>
    </div>
    <div class="chatlist__chat chat">
        <div class="chat__top">
        {{#if current}}
            <div class="chat__info">
                <div class="chat__avatar"></div>
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
    {{#if activeModalSettings}}
    <div class="chat__background" ref="background">
        <div class="newchat">
    <div class="newchat__title">Настройки чата</div>
    <form class="newchat__form" ref="formchatsettings">
                <div class="newchat__line">
                    <div class="newchat__fieldname">ID пользователя</div>
                    <input class="newchat__fieldvalue" name="user" placeholder="1234">
                </div>
        <div class="newchat__buttons">
            <button type="submit" class="newchat__confirm" value="add">Добавить пользователя</button>
            <button type="submit" class="newchat__confirm newchat__confirm_red" value="remove">Удалить пользователя</button>
        </div>
    </form>
    </div>
    </div>
    {{/if}}
    </div>
</div>
  `;
}
