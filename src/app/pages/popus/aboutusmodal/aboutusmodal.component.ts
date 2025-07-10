import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-aboutusmodal',
  templateUrl: './aboutusmodal.component.html',
  styleUrls: ['./aboutusmodal.component.scss']
})
export class AboutusmodalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AboutusmodalComponent>) { }

  ngOnInit() {
  }

}
