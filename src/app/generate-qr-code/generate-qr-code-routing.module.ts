import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateQrCodePage } from './generate-qr-code.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateQrCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateQrCodePageRoutingModule {}
