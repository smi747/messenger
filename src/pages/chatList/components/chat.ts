import Block from "../../../framework/Block";
import { BlockOwnProps } from "../../../framework/Block";
import Store from "../../../framework/Store";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Indexed<T = any> = {
    [key in string]: T;
};

interface ChatProps extends BlockOwnProps {
    name: string;
    avatar: string;
    content: string;
    time: string;
    indicator: string;
    id: number;
    active: boolean;
}

export default class Chat extends Block<ChatProps> {
    static componentName = "Chat";

    constructor(props: ChatProps) {
        super(props);
        let state = this.mapStateToProps(Store.getState());
        Store.subscribe(() => {
            // при обновлении получаем новое состояние
            const newState = this.mapStateToProps(Store.getState());

            // если что-то из используемых данных поменялось, обновляем компонент
            if (!(state == newState)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.setProps({ ...(newState as Indexed<any>) });
            }

            // не забываем сохранить новое состояние
            state = newState;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapStateToProps = (state: Indexed<any>) => {
        let res = false;
        try {
            if (this.props.id == state.currentID) {
                res = true;
            }
        } catch {}
        return {
            active: res,
        };
    };

    protected events = {
        click: (event: Event) => {
            event.stopPropagation();
            Store.setState("current", this.props);
            Store.setState("currentID", this.props.id);
        },
    };

    protected template = `
    <div class="catalog__wrap {{#if active}} catalog__active{{/if}}">
    <div class="catalog__element">
        <div class="catalog__avatar">{{#if avatar}}<img class="catalog__avatarimg" src="https://ya-praktikum.tech/api/v2/resources/{{avatar}}">{{/if}}</div>
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
