import { Injectable } from "@angular/core"; 
import { Playground } from '@contracts/Playground';
import { MetaMask } from "ngeth";

@Injectable({ providedIn: 'root' })
export class PlaygroundContract extends Playground {

  constructor(metamask: MetaMask) {
    super(metamask.getSigner());
  }
}