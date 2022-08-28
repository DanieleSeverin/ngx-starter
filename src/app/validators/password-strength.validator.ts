import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

//La password deve avere almeno un carattere maiuscolo, almeno uno minuscolo e almeno un carattere numerico.
export function createPasswordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        const hasSpecialCharacters = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialCharacters;

        return !passwordValid ? {passwordStrength:true}: null;
    }
}