import { NgModule } from '@angular/core';
import { IpfsImgDirective } from './directives';

@NgModule({
  declarations: [IpfsImgDirective],
  exports: [IpfsImgDirective],
})
export class IpfsModule {}
