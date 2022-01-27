import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class RegisterValidator {
  static firstName(control: FormControl): { [key: string]: boolean } | null {
    const symbol = /^[a-zA-Z]+$/;
    if (!symbol.test(control.value)) {
      return { name: true };
    }
    return null;
  }

  static password(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const passwordRegexp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (passwordRegexp.test(control.value)) {
      return null;
    }
    return {
      password: true,
    };
  }

  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        return { controlNotFound: false };
      }

      const error =
        control.value !== matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(error);

      return error;
    };
  }
}
