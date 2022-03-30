import { NgModule } from '@angular/core';
import { IpfsImgDirective, IpfsInputDirective } from './directives';
import { IpfsPipe } from './pipes';

@NgModule({
  declarations: [IpfsImgDirective, IpfsInputDirective, IpfsPipe],
  exports: [IpfsImgDirective, IpfsInputDirective, IpfsPipe],
})
export class IpfsModule {}
