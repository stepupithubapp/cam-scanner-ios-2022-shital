import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CropFilePageRoutingModule } from './crop-file-routing.module';

import { CropFilePage } from './crop-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropFilePageRoutingModule
  ],
  declarations: [CropFilePage]
})
export class CropFilePageModule {}
