import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BuzonClient } from 'src/app/app.modelsWebShop';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup
  public dateNow: Date
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(public dialogRef: MatDialogRef<SignupComponent>, public formBuilder: FormBuilder, public snackBar: MatSnackBar,
    public _appService: AppService) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required])],
      'phone': ['', Validators.compose([Validators.required])],
      'email':  ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'message': ['', Validators.compose([Validators.required])]
    });
  }


  public saveNewClient() {
    
  }

  get email() { return this.signupForm.get('email') }

}
