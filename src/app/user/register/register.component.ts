import { Component } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EmailTaken } from 'src/app/shared/validators/email-taken';
import { RegisterValidator } from './register.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  public showAlert: boolean = false;
  public alertMessage: string = '';
  public alertColor: string = 'blue';
  public inSubmission: boolean = false;

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        RegisterValidator.firstName,
      ]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
      ),
      age: new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(80),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        RegisterValidator.password,
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        RegisterValidator.password,
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
      ]),
    },
    [RegisterValidator.match('password', 'confirmPassword')]
  );

  public async onRegister(): Promise<void> {
    this.showAlert = true;
    this.alertMessage = 'Please wait...';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      this.auth.createUser(this.registerForm.value);
    } catch (error: any) {
      this.alertMessage = error.message;
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.alertMessage = 'Successfully registered';
    this.alertColor = 'green';
  }
}
