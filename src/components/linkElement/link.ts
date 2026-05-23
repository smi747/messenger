import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";
import Router from "../../router.js";

interface LinkProps extends BlockOwnProps {
    href: string;
    class: string;
    "data-page": string;
    text: string;
}

export default class Link extends Block<LinkProps> {
    static componentName = "Link";

    constructor(props: LinkProps) {
        super(props);
    }

    protected events = {
        click: (event: Event) => {
            event.preventDefault();
            if (event.currentTarget instanceof HTMLAnchorElement) {
                Router.go(this.props.href);
            }
        }
    };

    protected template = `
    <a href="{{href}}" class="{{class}}" data-page="{{data-page}}" tabindex="0">{{text}}</a>
  `;
}
