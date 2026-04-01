import Block from '../../framework/Block'

export default class InternalServerError extends Block {
  static componentName = 'internalServerError';

  protected template = `
<div class="servererror">
    {{{ Error code="500" text="Internal Server Error" }}}
{{{ Header }}}
</div>
  `;
}
