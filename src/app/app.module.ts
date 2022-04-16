import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DocumentScanner } from '@awesome-cordova-plugins/document-scanner/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import { AdvertisementService } from './advertisement.service';
import { LocalService } from './local.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
  HttpClient,
  DocumentScanner,
  BarcodeScanner,
  File,
  FileTransfer,
  Market,
  Network,
  AppVersion,
  SocialSharing,
  ImagePicker,
  AdMobFree,
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
