import { Component, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { LocalService } from '../local.service';

@Component({
  selector: 'app-digital-sign',
  templateUrl: './digital-sign.page.html',
  styleUrls: ['./digital-sign.page.scss'],
})

export class DigitalSignPage implements OnInit {
  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;

  constructor(public local: LocalService,) {}

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  // Change pad color
  changeColorButton(event) {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var color = "rgb(" + r + "," + g + "," + b +")";

    this.signaturePad.penColor = color;
  };

  // Clear sign pad
  clearButton(event) {
    this.signaturePad.clear();
  }

  // Undo sign
  undoButton(event) {
    var data = this.signaturePad.toData();

    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }

  // Save sign
  saveSign(event) {
    if (this.signaturePad.isEmpty()) {
      this.toast.show("Please provide a signature first.", '2000', 'bottom').subscribe(toast => {});
    } else {

      this.local.saveDigitalSign(this.signaturePad.toDataURL(), event, ()=>{
        this.toast.show("Sign Saved Successfully.", '2000', 'bottom').subscribe(toast => {});
        this.clearButton();
        this.router.navigate(['/folder']);
      });
    }
  };
}
