import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ABIDescription, FunctionDescription } from '@type/solc';
import { map } from 'rxjs';
import { ViewComponent } from '../view.component';
interface ABIOrder {
  writes: FunctionDescription[];
  reads: FunctionDescription[];
}


function formABI(abi: ABIDescription[]) {
  const order: ABIOrder = { writes: [], reads: [] };
  for (const description of abi) {
    if (description.type !== 'function') continue;
    if (description.stateMutability === 'view' || description.stateMutability === 'pure') {
      order.writes.push(description);
    } else {
      order.reads.push(description);
    }
  }
  return order;
}

@Component({
  selector: 'explorer-contract-abi',
  templateUrl: './abi.component.html',
  styleUrls: ['./abi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbiComponent {
  forms$ = this.shell.contract$.pipe(
    map(contract => formABI(contract.abi))
  );

  constructor(private shell: ViewComponent) { }

}
