import { NgModule } from '@angular/core';
import { IpfsImgDirective } from './directives';
import { IpfsPipe } from './pipes';

@NgModule({
  declarations: [IpfsImgDirective, IpfsPipe],
  exports: [IpfsImgDirective, IpfsPipe],
})
export class IpfsModule {}
