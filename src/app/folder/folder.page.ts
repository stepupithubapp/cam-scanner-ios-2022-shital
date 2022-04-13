import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentScanner, DocumentScannerOptions } from '@awesome-cordova-plugins/document-scanner';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  constructor(
    private router: Router,
    // private documentScanner: DocumentScanner,
    private barcodeScanner: BarcodeScanner,
  ) { }

  ngOnInit() {
    this.getRecentDocs();
  }

  getRecentDocs() {
    
  }

  navigatepage(page) {
    this.router.navigate([page]);
  }

  openCamera() {
    this.router.navigate(['/camera']);
  }

  startScaning() {
    let opts: DocumentScannerOptions = {};
    // this.documentScanner.scanDocument(opts)
    //   .then((res: string) => console.log(res))
    //   .catch((error: any) => console.error(error));
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
     console.log('Barcode data', barcodeData);
    }).catch(err => {
        console.log('Error', err);
    });
  }
}
