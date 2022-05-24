import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../explorer';

@Component({
  selector: 'eth-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  blocks$ = this.explorer.blocks$;
  constructor(private explorer: BlockExplorer) {}
}
