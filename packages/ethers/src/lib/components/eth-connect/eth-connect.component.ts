import { Component, ChangeDetectionStrategy, Directive, TemplateRef, ContentChild } from '@angular/core';
import { ChainManager } from '../../chain';
import { MetaMask } from '../../metamask';

@Directive({ selector: '[ethIdenticon]' })
export class EthIdenticonDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'eth-connect',
  templateUrl: './eth-connect.component.html',
  styleUrls: ['./eth-connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EthConnectComponent {

  @ContentChild(EthIdenticonDirective) identicon?: EthIdenticonDirective;

  connected$ = this.metamask.connected$;
  account$ = this.metamask.account$;
  chain$ = this.chain.chain$;

  constructor(
    private chain: ChainManager,
    private metamask: MetaMask,
  ) {}

  connect() {
    this.metamask.enable();
  }
}
