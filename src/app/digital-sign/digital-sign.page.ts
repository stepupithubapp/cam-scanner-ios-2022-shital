import { Component, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-digital-sign',
  templateUrl: './digital-sign.page.html',
  styleUrls: ['./digital-sign.page.scss'],
})

export class DigitalSignPage implements OnInit {
  @ViewChild('canvas', { static: true }) signaturePadElement;
  signaturePad: any;

  constructor() {}

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  changeColorButton(event) {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var color = "rgb(" + r + "," + g + "," + b +")";

    this.signaturePad.penColor = color;
  };

  clearButton(event) {
    this.signaturePad.clear();
  }

  undoButton(event) {
    var data = this.signaturePad.toData();

    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }

  saveSign(event) {
    if (this.signaturePad.isEmpty()) {
      alert("Please provide a signature first.");
    } else {
      var dataURL = this.signaturePad.toDataURL();
      // download(dataURL, "signature.png");
    }
  };

// saveJPGButton.addEventListener("click", function (event) {
//   if (signaturePad.isEmpty()) {
//     alert("Please provide a signature first.");
//   } else {
//     var dataURL = signaturePad.toDataURL("image/jpeg");
//     download(dataURL, "signature.jpg");
//   }
// });

// saveSVGButton.addEventListener("click", function (event) {
//   if (signaturePad.isEmpty()) {
//     alert("Please provide a signature first.");
//   } else {
//     var dataURL = signaturePad.toDataURL('image/svg+xml');
//     download(dataURL, "signature.svg");
//   }
}
