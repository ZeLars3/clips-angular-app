import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showAlert: boolean = false;
  alertMessage: string = 'Please wait...';
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  async onLogin() {
    this.showAlert = true;
    this.alertMessage = 'Please wait...';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      const { email, password } = this.loginForm.value;
      const user = await this.auth.signInWithEmailAndPassword(email, password);

    } catch (error: any) {
      this.inSubmission = false;
      this.alertMessage = error.message;
      this.alertColor = 'red';

      console.error(error);

      return;
    }
    this.alertMessage = 'Successfully logged in!';
    this.alertColor = 'green';
  }
}
