import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  IFSCPatternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[A-Za-z]{4}[a-zA-Z0-9]{7}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidIFSC: true };
    };
  }

  MatchPassword(control: AbstractControl) {
    const userPassword = control.get('userPassword').value;
    const userConfirmPassword = control.get('userConfirmPassword').value;
    if (userPassword !== userConfirmPassword) {
      control.get('userConfirmPassword').setErrors({ userConfirmPassword: true });
    } else {
      return null;
    }
  }

  DateValidator(control: AbstractControl) {
    const selectedDate = (new Date(control.get('tDate').value)).getFullYear();
    const currentYear = (new Date()).getFullYear();
    if (currentYear !== selectedDate) {
      control.get('tDate').setErrors({ IsValidYear: true });
    } else {
      return null;
    }
  }

  // only Char and Number allow

  OnlyCharacterAndNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[A-Za-z0-9]');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPanNumber: true };
    };
  }

  cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
      return { required: true };
    }
    return null;
  }

  // The set method is use for encrypt the value.
  set(keys, value) {
    const key = CryptoJS.enc.Utf8.parse(keys);
    const iv = CryptoJS.enc.Utf8.parse(keys);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

  // The get method is use for decrypt the value.
  get(keys, value) {
    const key = CryptoJS.enc.Utf8.parse(keys);
    const iv = CryptoJS.enc.Utf8.parse(keys);
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
