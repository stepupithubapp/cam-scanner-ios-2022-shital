import { Injectable } from "@angular/core";
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Platform, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  spinnerfareche: any;
  motiadnirequest: any =false;
  
  constructor(
    public admobfree: AdMobFree,
    public platform: Platform,
    public loadingController: LoadingController
  ) {

    this.platform.ready().then(() => {
      this.initBanner();
      this.prepareFullPageAds();
    });

    this.admobfree.on(this.admobfree.events.INTERSTITIAL_CLOSE).subscribe(() =>{
      this.prepareFullPageAds();
    });

    this.admobfree.on(this.admobfree.events.INTERSTITIAL_LOAD).subscribe(() =>{
      if (this.motiadnirequest) {
        this.admobfree.interstitial.show();
      }
    });

    this.admobfree.on(this.admobfree.events.INTERSTITIAL_OPEN).subscribe(() =>{
      this.motiadnirequest = false;
    });

    this.admobfree.on(this.admobfree.events.BANNER_LOAD_FAIL).subscribe(() =>{
      this.admobfree.banner.hide();
    });
  }

  showFullAds() {
    this.showLoader().then(() => {
      this.motiadnirequest = true;
      this.admobfree.interstitial.isReady().then((ready)=>{
        if (ready){
          this.admobfree.interstitial.show();
        }
        if (this.spinnerfareche){
          this.spinnerfareche.dismiss();
       }       
      }).catch((err)=>{
        if (this.spinnerfareche){
          this.spinnerfareche.dismiss();
        }
      })     
    });

    this.admobfree.on(this.admobfree.events.INTERSTITIAL_OPEN).subscribe(() => {
      if (this.spinnerfareche){
        this.spinnerfareche.dismiss();
      }
    });

    this.admobfree.on(this.admobfree.events.INTERSTITIAL_LOAD_FAIL).subscribe(() => {
      if (this.spinnerfareche){
        this.spinnerfareche.dismiss();
      }
    });
  }

  initBanner() {   
    const bannerConfig: AdMobFreeBannerConfig = {
     // id: 'ca-app-pub-3700728504497515/3356166781',
     id: 'ca-app-pub-3940256099942544/6300978111',
      autoShow: true,
      isTesting: false,
      bannerAtTop: false,
      overlap: false
    };
    this.admobfree.banner.config(bannerConfig);
    this.admobfree.banner.prepare()
      .then(() => { })
      .catch(e => { });
  }

  prepareFullPageAds() {       
    const InterstitialConfig: AdMobFreeInterstitialConfig = {
      // id: 'ca-app-pub-3700728504497515/7223776526',
      id: 'ca-app-pub-3940256099942544/1033173712',
      autoShow: false,
      isTesting: false
    };
    this.admobfree.interstitial.config(InterstitialConfig);
    this.admobfree.interstitial.prepare()
      .then(() => { })
      .catch(e => { });     
  }

  hideAdmobBanner() {
    this.admobfree.banner.hide().then(() => {}).catch(e => console.log("ads>>", e));
  }

  showAdmobBanner() {
    this.admobfree.banner.show().then(() => {}).catch(e => console.log("ads>>", e));
  }

  async showLoader() {
     const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

  randomAdsShow() {
    var items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16];
    var item = items[Math.floor(Math.random() * items.length)];

    if (item == 1 || item == 5 || item == 10 || item == 15) {
      this.showFullAds();
    }
    return true;
  }

}


