import { isLoggedIn } from "./services/isLoggedIn.js";

import type Block from "./framework/Block";

type BlockClass = new () => Block;

interface RouteProps {
    rootQuery: string;
}

function isEqual(lhs: string, rhs: string): boolean {
    return lhs === rhs;
}

function render(query: string, block: Block): HTMLElement | null {
    const root = document.getElementById(query);

    if (!root) {
        return null;
    }

    root.innerHTML = "";
    root.appendChild(block.element() as Element);

    return root;
}

class Route {
    private _pathname: string;
    private _blockClass: BlockClass;
    private _block: Block | null;
    private _props: RouteProps;

    constructor(pathname: string, view: BlockClass, props: RouteProps) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    navigate(pathname: string): void {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    match(pathname: string): boolean {
        return isEqual(pathname, this._pathname);
    }

    render(): void {
        if (!this._block) {
            this._block = new this._blockClass();
        }

        render(this._props.rootQuery, this._block);
    }
}

class Router {
    private static __instance: Router;

    private routes: Route[] = [];
    private history: History = window.history;
    private _rootQuery = "app";

    constructor() {
        if (Router.__instance) {
            return Router.__instance;
        }

        Router.__instance = this;
    }

    use(pathname: string, block: BlockClass): Router {
        const route = new Route(pathname, block, {
            rootQuery: this._rootQuery,
        });

        this.routes.push(route);

        return this;
    }

    start(): void {
        window.onpopstate = (event: PopStateEvent) => {
            const target = event.currentTarget as Window;

            this._onRoute(target.location.pathname);
        };

        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathname: string): void {
        const route = this.getRoute(pathname);

        if (!route) {
            this.go("/404");
            return;
        }

        isLoggedIn().then((result: boolean) => {
            if (result && (pathname === "/" || pathname === "/sign-up")) {
                this.go("/messenger");
                return;
            }

            if (
                !result &&
                pathname !== "/" &&
                pathname !== "/sign-up"
            ) {
                this.go("/");
                return;
            }

            route.render();
        });
    }

    go(pathname: string): void {
        this.history.pushState({}, "", pathname);
        this._onRoute(pathname);
    }

    getRoute(pathname: string): Route | undefined {
        return this.routes.find((route) => route.match(pathname));
    }
}

const router = new Router();

export default router;
