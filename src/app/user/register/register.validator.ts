import { FormControl } from '@angular/forms';

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
}
