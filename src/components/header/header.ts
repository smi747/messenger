import Block from '../../framework/Block'

export default class Link extends Block {
  static componentName = 'Header';

  protected template = `
    <div class="header">
  <nav>
    {{{ Link href="#" class="header-link" data-page="logIn" text="logIn" }}}
    {{{ Link href="#" class="header-link" data-page="signUp" text="signUp" }}}
    {{{ Link href="#" class="header-link" data-page="chatList" text="chatList" }}}
    {{{ Link href="#" class="header-link" data-page="userProfile" text="userProfile" }}}
    {{{ Link href="#" class="header-link" data-page="notFound" text="notFound" }}}
    {{{ Link href="#" class="header-link" data-page="internalServerError" text="InternalServerError" }}}
  </nav>
</div>
  `;
}
