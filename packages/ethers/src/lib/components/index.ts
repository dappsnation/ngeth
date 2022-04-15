import { BlockiesComponent } from './blockies';
import { EthConnectComponent, IdenticonDirective } from './eth-connect/eth-connect.component';
import { EtherInputDirective } from './ether';
import { JazzIconComponent } from './jazzicon';

export * from './jazzicon';
export * from './blockies';
export * from './ether';
export * from './eth-connect/eth-connect.component';

export const ethersComponents = [EtherInputDirective, JazzIconComponent, BlockiesComponent, EthConnectComponent, IdenticonDirective];
