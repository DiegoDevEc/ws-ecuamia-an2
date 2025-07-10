import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<QuestionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  _si(){
    this.dialogRef.close(true)
  }

  _no(){
    this.dialogRef.close(false)
  }

}
