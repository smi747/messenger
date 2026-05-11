import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import ChatlistController from "../../controllers/chatlistController.js";
import Store from "../../framework/Store";
import isEqual from "../../utils/isEqual";

type Indexed<T = any> = {
    [key in string]: T;
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
        console.log("chatlist");
        return {
            chats: structuredClone(state.chatList),
            current: structuredClone(state.current)
        };
    };

    protected events = {
        click: (event: Event) => {
            if (event.target == this.refs.background) {
            }
        }
    }

    protected template = `
    <div class="chatlist">
    <div class="chatlist__catalog catalog">
        <div class="catalog__functions">
            <button class="catalog__button">Новый чат</button>
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
            <button class="chat__functions">
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
    </div>
</div>
  `;
}
