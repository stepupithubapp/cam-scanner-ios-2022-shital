import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageScanDocumentPage } from './manage-scan-document.page';

const routes: Routes = [
  {
    path: '',
    component: ManageScanDocumentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageScanDocumentPageRoutingModule {}
