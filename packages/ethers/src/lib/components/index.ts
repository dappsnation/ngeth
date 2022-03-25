import { BlockiesComponent } from './blockies';
import { EthConnectComponent, IdenticonDirective } from './eth-connect/eth-connect.component';
import { JazzIconComponent } from './jazzicon';

export * from './jazzicon';
export * from './blockies';
export * from './eth-connect/eth-connect.component';

export const ethersComponents = [JazzIconComponent, BlockiesComponent, EthConnectComponent, IdenticonDirective];
