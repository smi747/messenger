import Block from "../../framework/Block";

export default class NotFound extends Block {
    static componentName = "NotFound";

    protected template = `
<div class="notfound">
    {{{ Error code="404" text="Not Found" }}}
{{{ Header }}}
</div>
  `;
}
