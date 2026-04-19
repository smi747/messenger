import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import Router from "../../router.js";

interface LinkProps extends BlockOwnProps {
    href: string;
    class: string;
    "data-page": string;
    swap: string;
    text: string;
}

export default class Link extends Block<LinkProps> {
    static componentName = "Link";

    protected events = {
        click: (event: Event) => {
            event.stopPropagation();
            event.preventDefault();
            Router.go(this.props.swap);
        },
    };

    protected template = `
    <a href="{{href}}" class="{{class}}" data-page="{{data-page}}" onclick="{{onclick}}">{{text}}</a>
  `;
}
