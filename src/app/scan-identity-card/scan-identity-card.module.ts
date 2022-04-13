import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanIdentityCardPageRoutingModule } from './scan-identity-card-routing.module';

import { ScanIdentityCardPage } from './scan-identity-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanIdentityCardPageRoutingModule
  ],
  declarations: [ScanIdentityCardPage]
})
export class ScanIdentityCardPageModule {}
