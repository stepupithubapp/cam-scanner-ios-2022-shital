import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CropFilePage } from './crop-file.page';

const routes: Routes = [
  {
    path: '',
    component: CropFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CropFilePageRoutingModule {}
