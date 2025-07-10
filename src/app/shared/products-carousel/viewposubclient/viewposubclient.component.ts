import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-viewposubclient',
  templateUrl: './viewposubclient.component.html',
  styleUrls: ['./viewposubclient.component.scss']
})
export class ViewposubclientComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewposubclientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public app_service: AppService) { }

  ngOnInit() {
  }

  public selectCode(code){
    this.dialogRef.close()
  }

  close(){
    this.dialogRef.close()
  }

}
 