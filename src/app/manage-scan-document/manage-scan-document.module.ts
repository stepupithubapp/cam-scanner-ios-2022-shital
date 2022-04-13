import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageScanDocumentPageRoutingModule } from './manage-scan-document-routing.module';

import { ManageScanDocumentPage } from './manage-scan-document.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageScanDocumentPageRoutingModule
  ],
  declarations: [ManageScanDocumentPage]
})
export class ManageScanDocumentPageModule {}
