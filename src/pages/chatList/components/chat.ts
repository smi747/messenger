import Block from '../../../framework/Block'
import {BlockOwnProps} from '../../../framework/Block'

interface ChatProps extends BlockOwnProps{
    name: string;
    content: string;
    time: string;
    indicator: string;
}

export default class Chat extends Block<ChatProps> {
  static componentName = 'Chat';

  protected template = `
    <div class="catalog__wrap">
    <div class="catalog__element">
        <div class="catalog__avatar"></div>
        <div class="catalog__info">
            <div class="catalog__name">{{name}}</div>
            <div class="catalog__content">{{content}}</div>
        </div>
        <div class="catalog__details">
            <div class="catalog__time">{{time}}</div>
            <div class="catalog__indicator">{{indicator}}</div>
        </div>
    </div>
</div>
  `;
}
