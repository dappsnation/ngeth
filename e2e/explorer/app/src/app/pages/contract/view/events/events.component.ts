import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../../explorer';
import { ViewComponent } from '../view.component';
import { Log } from '@ethersproject/abstract-provider';
import { Interface } from '@ethersproject/abi';
import { combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'explorer-contract-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsComponent {
  logs$ = combineLatest([
    this.explorer.logs$,
    this.shell.address$,
  ]).pipe(
    map(([logs, address]) => logs[address]),
    distinctUntilChanged((prev, next) => prev.length !== next.length)
  );

  interface$ = this.shell.contract$.pipe(
    map(contract => contract.artifact.abi),
    distinctUntilChanged((prev, next) => prev.length !== next.length),
    map(abi => new Interface(abi)),
  );

  events$ = combineLatest([
    this.interface$,
    this.logs$,
  ]).pipe(
    map(([parser, logs]) => logs.map(log => this.getEvent(parser, log))),
  )

  constructor(
    private shell: ViewComponent,
    private explorer: BlockExplorer
  ) {}

  private getEvent(parser: Interface, log: Log) {
    const { name, eventFragment, args } = parser.parseLog(log);
    const results = eventFragment.inputs.map((input, i) => ({
      name: input.name,
      type: input.type,
      indexed: input.indexed,
      value: args[i],
    }))
    return { name, results, blockNumber: log.blockNumber }
  }
}
