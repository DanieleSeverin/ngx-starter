import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core/error/error-options";

export class CustomErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl, form: NgForm | FormGroupDirective | null) {
      return control && control.invalid && control.touched;
    }
  }