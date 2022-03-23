import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ERC20Pipe } from "./pipes";

@NgModule({
  declarations: [ERC20Pipe],
  exports: [ERC20Pipe],
  imports: [CommonModule]
})
export class ERC20Module {}