import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentScanner, DocumentScannerOptions } from '@awesome-cordova-plugins/document-scanner';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

import { LocalService } from '../local.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  loadingRecentDoc: boolean = false;
  recentDocs: any = [];

  constructor(
    private router: Router,
    private local: LocalService,
    private file: File,
    // private documentScanner: DocumentScanner,
    private barcodeScanner: BarcodeScanner,
  ) { }

  ngOnInit() {
    this.getRecentDocs();
  }

  getRecentDocs() {
      try {
        this.loadingRecentDoc = true;

        this.file.listDir(this.file.dataDirectory, 'cam-scanner-advance')
        .then((entries) => {
          
          if (entries && entries.length) {
            let count = 0;
            let tmpData = [];

            const getFileInfo = ()=> {
              if (count < entries.length) {
                this.file.resolveLocalFilesystemUrl(entries[count]['nativeURL']).then((fileEntry) => {
                  fileEntry.getMetadata(fileObj => {
                    entries[count]['date'] = fileObj['modificationTime'];
                    entries[count]['docName'] = entries[count]['name'].substr(0, entries[count]['name'].lastIndexOf('.'));
                    entries[count]['ext'] = entries[count]['name'].split('.').pop();
                    entries[count]['isSelect'] = false;
                    
                    if (entries[count]['ext'] == 'jpg' || entries[count]['ext'] == 'png') {
                      entries[count]['image'] = (window as any).Ionic.WebView.convertFileSrc(entries[count]['nativeURL']);
                    }

                    tmpData.push(entries[count]);

                    count += 1;
                    getFileInfo();
                  });
                });
              } else {
                this.recentDocs = this.local.sortData(tmpData, 'date');
                this.loadingRecentDoc = false;
              }
            }

            getFileInfo();
          } else {
            this.loadingRecentDoc = false;
          }
        })
        .catch(e => {
          this.recentDocs = [];
          this.loadingRecentDoc = false;
        });
      } catch(erre) {
        this.recentDocs = [];
        this.loadingRecentDoc = false;
      }
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
