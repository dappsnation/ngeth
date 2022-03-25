import { Component, ChangeDetectionStrategy, Directive, TemplateRef, ContentChild, Output, EventEmitter } from '@angular/core';
import { ChainManager } from '../../chain';
import { MetaMask } from '../../metamask';

@Directive({ selector: '[ethIdenticon]' })
export class IdenticonDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'eth-connect',
  templateUrl: './eth-connect.component.html',
  styleUrls: ['./eth-connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EthConnectComponent {

  @ContentChild(IdenticonDirective) identicon?: IdenticonDirective;

  @Output() connect = new EventEmitter();

  account$ = this.metamask.account$;
  chain$ = this.chain.chain$;

  constructor(
    private chain: ChainManager,
    private metamask: MetaMask,
  ) {}

  async enable() {
    const accounts = await this.metamask.enable();
    if (accounts.length) this.connect.emit(accounts[0]);
  }
}
