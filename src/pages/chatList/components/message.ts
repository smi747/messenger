import Block from "../../../framework/Block";
import { BlockOwnProps } from "../../../framework/Block";

interface MessageProps extends BlockOwnProps {
    my: string;
    content: string;
    time: string;
}

export default class Message extends Block<MessageProps> {
    static componentName = "Message";

    protected template = `
    <div class="chat__message {{#if my}}chat__message_my{{/if}}">
    {{content}}
        <div class="chat__details">
            {{#if my}}
            <svg class="chat__checkmark" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                <line y1="-0.5" x2="3.765" y2="-0.5" transform="matrix(0.705933 0.708278 -0.705933 0.708278 0 2.04126)" stroke="#3369F3"/>
                <line y1="-0.5" x2="5.6475" y2="-0.5" transform="matrix(0.705933 -0.708278 0.705933 0.708278 2.6582 4.70825)" stroke="#3369F3"/>
                <line y1="-0.5" x2="5.6475" y2="-0.5" transform="matrix(0.705933 -0.708278 0.705933 0.708278 5.31592 4.70825)" stroke="#3369F3"/>
            </svg>
            {{/if}}
            <div class="chat__time {{#if my}}chat__time_my{{/if}}">{{time}}</div>
        </div>
    </div>
  `;
}
