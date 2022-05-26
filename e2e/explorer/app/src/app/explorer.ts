import { Injectable, OnDestroy } from '@angular/core';
import { Provider, Block } from '@ethersproject/providers';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { map, filter, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BlockExplorer implements OnDestroy {
  #blockChanges = new ReplaySubject<number>();
  #blocks: Block[] = [];
  blockNumber$ = this.#blockChanges.asObservable();
  blocks$ = this.#blockChanges.asObservable().pipe(
    map(() => this.#blocks),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(private provider: Provider) {
    this.init();
  }

  async init() {
    this.provider.on('block', async (blockNumber: number) => {
      this.#blocks[blockNumber] = await this.provider.getBlock(blockNumber);
      this.#blockChanges.next(blockNumber);
    });
    const current = await this.provider.getBlockNumber();
    for (let i = 0; i < current; i++) {
      this.provider.getBlock(i).then((block) => (this.#blocks[i] = block));
    }
  }

  ngOnDestroy() {
    this.provider.off('block');
  }

  async get(blockNumber: number) {
    if (blockNumber in this.#blocks) return this.#blocks[blockNumber];
    const obs = this.blocks$.pipe(
      filter((blocks) => blockNumber in blocks),
      map((blocks) => blocks[blockNumber])
    );
    return firstValueFrom(obs);
  }
}
