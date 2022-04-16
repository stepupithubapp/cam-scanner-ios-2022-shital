import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { IonicModule } from '@ionic/angular';

import { GenerateQrCodePageRoutingModule } from './generate-qr-code-routing.module';

import { GenerateQrCodePage } from './generate-qr-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    GenerateQrCodePageRoutingModule
  ],
  declarations: [GenerateQrCodePage]
})
export class GenerateQrCodePageModule {}
