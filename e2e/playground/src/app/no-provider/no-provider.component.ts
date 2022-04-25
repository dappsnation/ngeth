import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HasProviderGuard } from '@ngeth/ethers';

@Component({
  selector: 'ngeth-no-provider',
  templateUrl: './no-provider.component.html',
  styleUrls: ['./no-provider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoProviderComponent {
  previous = this.guard.previous;
  constructor(private guard: HasProviderGuard) { }

}
