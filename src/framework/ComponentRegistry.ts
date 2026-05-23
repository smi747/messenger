import Handlebars from "handlebars";
import { HelperOptions } from "handlebars";
import Block, { BlockOwnProps } from "./Block";

let uniqueId = 0;

type BlockConstructor<
    P extends BlockOwnProps = BlockOwnProps,
    T extends Block<P> = Block<P>
> = {
    new (props: P): T;
    componentName: string;
};

function registerComponent<
    P extends BlockOwnProps = BlockOwnProps,
    T extends Block<P> = Block<P>
>(Component: BlockConstructor<P, T>) {
    const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;

    Handlebars.registerHelper(
        Component.componentName,
        function (this: unknown, { hash, data }: HelperOptions) {
            const component = new Component(hash as P);

            if ("ref" in hash) {
                (data.root.__refs = data.root.__refs || {})[hash.ref] =
                    component.element();
            }

            (data.root.__children = data.root.__children || []).push({
                component,
                embed(node: DocumentFragment) {
                    const placeholder = node.querySelector(
                        `[${dataAttribute}]`,
                    );

                    if (!placeholder) {
                        throw new Error(
                            `Can't find data-id for component ${Component.componentName}`,
                        );
                    }

                    const element = component.element();

                    if (!element) {
                        throw new Error("Component element is not created");
                    }

                    placeholder.replaceWith(element);
                },
            });

            return new Handlebars.SafeString(
                `<div ${dataAttribute}></div>`,
            );
        },
    );
}

export { registerComponent };
