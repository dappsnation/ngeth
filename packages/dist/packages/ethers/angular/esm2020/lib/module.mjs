import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ethersComponents } from './components';
import { ethersPipes } from './pipes';
import * as i0 from "@angular/core";
import * as i1 from "./pipes";
import * as i2 from "./components/forms/ether";
import * as i3 from "./components/blockies/index";
import * as i4 from "./components/forms/address";
import * as i5 from "./components/connect/connect.component";
export class EthersModule {
}
EthersModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
EthersModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, declarations: [i1.BigNumberPipe, i1.EtherPipe, i1.EthCurrencyPipe, i1.ExplorePipe, i1.AddressPipe, i1.SupportedChainPipe, i1.ChainPipe, i2.EtherInputDirective, i3.BlockiesComponent, i4.AddressInputDirective, i5.EthConnectComponent], imports: [CommonModule], exports: [i1.BigNumberPipe, i1.EtherPipe, i1.EthCurrencyPipe, i1.ExplorePipe, i1.AddressPipe, i1.SupportedChainPipe, i1.ChainPipe, i2.EtherInputDirective, i3.BlockiesComponent, i4.AddressInputDirective, i5.EthConnectComponent] });
EthersModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [...ethersPipes, ...ethersComponents],
                    exports: [...ethersPipes, ...ethersComponents],
                    imports: [CommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZXRoZXJzL2FuZ3VsYXIvc3JjL2xpYi9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ2hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7Ozs7QUFRdEMsTUFBTSxPQUFPLFlBQVk7O3lHQUFaLFlBQVk7MEdBQVosWUFBWSxxUEFGYixZQUFZOzBHQUVYLFlBQVksWUFGYixZQUFZOzJGQUVYLFlBQVk7a0JBTHhCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQztvQkFDbkQsT0FBTyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQztvQkFDOUMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUN4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgZXRoZXJzQ29tcG9uZW50cyB9IGZyb20gJy4vY29tcG9uZW50cyc7XG5pbXBvcnQgeyBldGhlcnNQaXBlcyB9IGZyb20gJy4vcGlwZXMnO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogWy4uLmV0aGVyc1BpcGVzLCAuLi5ldGhlcnNDb21wb25lbnRzXSxcbiAgZXhwb3J0czogWy4uLmV0aGVyc1BpcGVzLCAuLi5ldGhlcnNDb21wb25lbnRzXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIEV0aGVyc01vZHVsZSB7fVxuXG4iXX0=