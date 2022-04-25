# IPFS for Angular

## Install

```
ng add @ngeth/ipfs
```

`ng add @ngeth/ipfs` can be very slow. In this case use: 
```
npm install @ngeth/ipfs
npx ng g @ngeth/ipfs:ng-add
```

## Getting Started

Run a deamon
```
npx ng ipfs-daemon
```

Inject the client in your app :
```typescript
import { Component, Inject } from '@angular/core';
import { IPFS, IPFSClient } from '@ngeth/ipfs';
...

@Component({ ... })
export class MyComponent {
  constructor(@Inject(IPFS) private ipfs: IpfsClient) {}
}
```

Configure the port: 
```typescript
import { IPFS_OPTIONS } from '@ngeth/ipfs';

@NgModule({
  ...,
  providers: [{
    provide: IPFS_OPTIONS,
    useValue: { port: 5001 }
  }]
})
```

## Directives
First import `IpfsModule` into your module : 
```typescript
import { IpfsModule } from '@ngeth/ipfs';

@NgModules({
  imports: [IpfsModule],
})
```

### Input
The `ipfsInput` will automatically upload a file into the ipfs node: 
```html
<input type="file" ipfsInput formControlName="image" />
```
_It only works with `type="file"` input_

### Img
Load the image from IPFS into the img tag : 
```html
<img ipfsCid="cidOrPath" />
```

## Pipe
First import `IpfsModule` into your module : 
```typescript
import { IpfsModule } from '@ngeth/ipfs';

@NgModules({
  imports: [IpfsModule],
})
```

### cat
Use `ipfs` pipe to get the content of an IPFS path or cid
```html
<p>{{ path | ipfs:'txt' }}</p>
<p>{{ path | ipfs:'json' | json }}</p>
<img [src]="path | ipfs:'url'">
```