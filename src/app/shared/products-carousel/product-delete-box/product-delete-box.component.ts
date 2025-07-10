import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-product-delete-box',
  templateUrl: './product-delete-box.component.html',
  styleUrls: ['./product-delete-box.component.scss']
})
export class ProductDeleteBoxComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ProductDeleteBoxComponent>) { }

  ngOnInit() {
  }

  public close(): void {
    this.dialogRef.close();
  }
}
