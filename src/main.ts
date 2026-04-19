import "./styles/main.scss";
import Router from "./router.js";

import { registerComponent } from "./framework/ComponentRegistry";
import Link from "./components/linkElement/link";
import Error_ from "./components/error/error";
import Auth from "./components/auth/auth";
import Header from "./components/header/header";
import Message from "./pages/chatList/components/message";
import Chat from "./pages/chatList/components/chat";
//import ChatList from "./pages/chatList/chatList";
//import NotFound from "./pages/notFound/notFound";
import LogIn from "./pages/logIn/logIn";
import SignUp from "./pages/signUp/signUp";
//import SignUp from "./pages/signUp/signUp";
//import InternalServerError from "./pages/internalServerError/internalServerError";
//import UserProfile from "./pages/userProfile/userProfile";

registerComponent(Link);
registerComponent(Error_);
registerComponent(Auth);
registerComponent(Header);
registerComponent(Message);
registerComponent(Chat);

Router.use('/', LogIn);
Router.use('/sign-up', SignUp);

document.addEventListener("DOMContentLoaded", () => {
    Router.start();
});
