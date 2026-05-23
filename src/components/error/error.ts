import Block from "../../framework/Block";
import { BlockOwnProps } from "../../framework/Block";

interface ErrorProps extends BlockOwnProps {
    code: string;
    text: string;
}

export default class Error extends Block<ErrorProps> {
    static componentName = "Error";

    constructor(props: ErrorProps) {
        super(props);
    }

    protected template = `
    <div class="error">
    <div class="error__code">{{code}}</div>
    <div class="error__name">{{text}}</div>
    <div class="error__back">{{{ Link href="/" class="error__link" data-page="chatList" text="Назад к чатам" }}}</div>
</div>
  `;
}
