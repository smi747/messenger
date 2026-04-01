import Block from '../../framework/Block'
import {BlockOwnProps} from '../../framework/Block'

type Message = {
    my: string;
    content: string;
    time: string;
};

type Chat = {
    name: string;
    content: string;
    time: string;
    indicator: string;
}

interface ChatListProps extends BlockOwnProps{
    messages: Message[];
    chats: Chat[];
}

export default class ChatList extends Block<ChatListProps> {
  static componentName = 'ChatList';

  protected template = `
    <div class="chatlist">
    <div class="chatlist__catalog catalog">
        <div class="catalog__functions">
            <button class="catalog__button">Новый чат</button>
            <button class="catalog__button">Профиль</button>
        </div>
        <div class="catalog__search">
            <input class="catalog__input" placeholder="Поиск">
        </div>
        <div class="catalog__list">
            {{#each chats}}
                {{{ Chat name=this.name content=this.content time=this.time indicator=this.indicator}}}
            {{/each}}
        </div>
    </div>
    <div class="chatlist__chat chat">
        <div class="chat__top">
            <div class="chat__info">
                <div class="chat__avatar"></div>
                <div class="chat__name">Дмитрий</div>
            </div>
            <button class="chat__functions">
                <div class="chat__dot"></div>
                <div class="chat__dot"></div>
                <div class="chat__dot"></div>
            </button>
        </div>
        <div class="chat__content">
            <div class="chat__date">19 июня</div>
             {{#each messages}}
                {{{ Message content=this.content time=this.time my=this.my }}}
             {{/each}}
        </div>
        <div class="chat__bottom">
            <input class="catalog__input" placeholder="Сообщение" name="message">
            <button class="catalog__send">→</button>
        </div>
    </div>

{{{ Header }}}
</div>
  `;
}
