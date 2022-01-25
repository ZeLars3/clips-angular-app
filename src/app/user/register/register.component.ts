import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterValidator } from './register.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  
  showAlert = false;
  alertMessage = '';
  alertColor = '';

  constructor() { }

  ngOnInit(): void {
  }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), RegisterValidator.firstName]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(80)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), RegisterValidator.password]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), RegisterValidator.password]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
  });


  onRegister() {
    this.showAlert = true;
    this.alertMessage = 'Please wait...';
    this.alertColor = 'blue';
    setTimeout(() => {
      this.alertMessage = 'Successfully registered!';
      this.alertColor = 'green';
    }, 3000);
  }
}
