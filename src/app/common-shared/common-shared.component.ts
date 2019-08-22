import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth.service';


@Component({
  selector: 'app-common-shared',
  templateUrl: './common-shared.component.html',
  styleUrls: ['./common-shared.component.css']
})
export class CommonSharedComponent implements OnInit {

  submitted;
  myForm: FormGroup;
  error: boolean;
  constructor(private fb: FormBuilder,
    private router: Router,
    private auth: FirebaseAuthService
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.email]],
        pwd: ['', [Validators.required, Validators.minLength(6)]],
      }
    );
  }
  _formSubmit() {
    this.submitted = true;
    let user = this.myForm.value
    if (this.myForm.invalid) {
      return;
    }
    else {
      if (user.username == "admin@admin.com" && user.pwd == "admin123") {
        this.router.navigate(['/admin'])
      }
      else {
        this.auth.login(user).
          then(res => {
            console.log("Login done");
            this.router.navigate(['/customer'])
          }, err => {
            console.log("Login not done");
            this.error = true;
          });
      }
    }
  }


}


