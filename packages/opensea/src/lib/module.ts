import { NgModule } from "@angular/core";
import { ContractUriPipe } from "./pipes";

@NgModule({
  declarations: [ContractUriPipe],
  exports: [ContractUriPipe],
})
export class OpenseaModule {}