import Block from '../../framework/Block'
import {BlockOwnProps} from '../../framework/Block'

interface LinkProps extends BlockOwnProps{
    text: string;
}

export default class Link extends Block<LinkProps> {
  static componentName = 'Input';

  protected template = `
    <a href="{{href}}" class="{{class}}" data-page="{{data-page}}" onclick="{{onclick}}">{{text}}</a>
  `;
}
