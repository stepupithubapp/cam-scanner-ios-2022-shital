import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanIdentityCardPage } from './scan-identity-card.page';

const routes: Routes = [
  {
    path: '',
    component: ScanIdentityCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanIdentityCardPageRoutingModule {}
