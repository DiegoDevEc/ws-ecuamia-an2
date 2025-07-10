import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from 'src/app/app.service';
import { Marcacion } from 'src/app/app.modelsWebShop';
import { Router } from '@angular/router';
import { PaginatePipe } from 'ngx-pagination';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-differentdestination',
  templateUrl: './differentdestination.component.html',
  styleUrls: ['./differentdestination.component.scss']
})
export class DifferentdestinationComponent implements OnInit {


  link;
  hiddeniframe = true;
  constructor(public dialogRef: MatDialogRef<DifferentdestinationComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    var url;
    if (this.data.link !== undefined) {
      url = this.data.link
    } else {
      url = 'http://www.flowersviainternet.net/Login169f1l1lf14pg.html';
    }
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(url);;
  }

  close() {
    this.dialogRef.close()
  }
  uploadDone() {
    this.hiddeniframe = false;
  }

}

