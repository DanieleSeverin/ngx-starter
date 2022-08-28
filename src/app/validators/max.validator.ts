import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

//La password deve avere almeno un carattere maiuscolo, almeno uno minuscolo e almeno un carattere numerico.
export function createMaxValidator(param : number): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        return value > param ? {max:true}: null;
    }
}