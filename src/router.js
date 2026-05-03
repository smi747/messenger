function isEqual(lhs, rhs) {
  return lhs === rhs;
}

function render(query, block) {
  const root = document.getElementById(query);
  root.innerHTML = "";
  root.appendChild(block.element());
  return root;
}

class Route {
  constructor(pathname, view, props) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname) {
    return isEqual(pathname, this._pathname);
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass();
      //return;
    }


    render(this._props.rootQuery, this._block);
    //this._block.show();
  }
}


class Router {
  constructor() {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = "app";

    Router.__instance = this;
  }

  use(pathname, block) {
      const route = new Route(pathname, block, {rootQuery: this._rootQuery});

      this.routes.push(route);

      return this;
  }

  start() {
    // Реагируем на изменения в адресной строке и вызываем перерисовку
    window.onpopstate = event => {
      this._onRoute(event.currentTarget.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname) {
    const route = this.getRoute(pathname);
    if (!route) {
        this.go("/404");
        return;
    }

    //if (this._currentRoute) {
    //  this._currentRoute.leave();
    //}

    route.render(route, pathname);
  }

  go(pathname) {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  getRoute(pathname) {
    return this.routes.find(route => route.match(pathname));
  }
}

const router = new Router();

export default router;
