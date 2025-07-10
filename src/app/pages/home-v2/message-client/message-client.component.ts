import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-message-client',
  templateUrl: './message-client.component.html',
  styleUrls: ['./message-client.component.scss']
})
export class MessageClientComponent implements OnInit {

  constructor(public appService: AppService, public dialog: MatDialog, public router: Router,
    public dialogRef: MatDialogRef<MessageClientComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  
  _continue() {
    this.dialogRef.close(true)
  }
  
  _cancel() {
    this.dialogRef.close(false)
  }

}
