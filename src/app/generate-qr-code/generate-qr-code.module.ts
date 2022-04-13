import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateQrCodePageRoutingModule } from './generate-qr-code-routing.module';

import { GenerateQrCodePage } from './generate-qr-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerateQrCodePageRoutingModule
  ],
  declarations: [GenerateQrCodePage]
})
export class GenerateQrCodePageModule {}
