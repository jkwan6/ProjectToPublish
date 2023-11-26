import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, from, map, Observable, of, retry } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { IComments } from '../../../interface/IComments';
import { ILoginRequest } from '../../../interface/ILoginRequest';
import { ISignUpRequest } from '../../../interface/ISignUpRequest';
import { BaseRepository } from '../../../repository/BaseRepository';
import { AuthenticationService } from '../../../service/AuthenticationService/AuthenticationService';
import { ErrorObject } from '../../../service/AuthenticationService/AuthTypes';
import { SharedUtils } from '../../../shared-utils/SharedUtils';


export interface IBoolObject {
  value: boolean
}

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css'],
  providers: [BaseRepository]
})
export class SignUpFormComponent implements OnInit {

  passwordHide = true                 // Property to Hide/Unhide password
  confirmPasswordHide = true;         // Property to Hide/Unhide confirmPassword
  formVariable!: ISignUpRequest;      // Update Type Based on Form Parameters
  form!: FormGroup;                   // ReactiveForm
  signupFailed: boolean = false;
  errorMessages: string[] = [];
 
  passwordCheck!: IBoolObject;
  emailCheck!: IBoolObject;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.passwordCheck = { value: false }
    this.emailCheck = { value: false }
  }

  ngOnInit(): void {
    this.InitialializeFormGroup();
  }

  // #region --> Code Module to Initialize FormGroup
  private InitialializeFormGroup() {

    this.formVariable = 
    { 
      userName: "", 
      email: "", 
      password: "", 
      confirmPassword: "" 
    }; // Gotta initialize First

    this.form = new FormGroup({});

    // Add Parameters to Form Group
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.userName),            // Update Property Here
      new FormControl("", Validators.required)                        // "" To initialize empty form
    );
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.password),         // Update Property Here
      new FormControl("", Validators.required)                        // "" To initialize empty form
    );
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.confirmPassword),  // Update Property Here
      new FormControl("", Validators.required)                        // "" To initialize empty form
    );
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.email),  // Update Property Here
      new FormControl("", Validators.required)                        // "" To initialize empty form
    );

    //// Add Validators to fields
    this.form.controls
    [SharedUtils.nameof(this.formVariable, x => x.confirmPassword)]
      .addAsyncValidators(
        [this.fieldMatches(
          SharedUtils.nameof(this.formVariable, x => x.password),
          SharedUtils.nameof(this.formVariable, x => x.confirmPassword),
          this.passwordCheck)]
    );

    // Update AsyncValidator when primary fields changes
    this.form.controls[SharedUtils.nameof(this.formVariable, x => x.password)].valueChanges.subscribe(() =>
      this.form.controls[SharedUtils.nameof(this.formVariable, x => x.confirmPassword)].updateValueAndValidity({ onlySelf: true, emitEvent: false }))
  }
  // #endregion

  // Assign User Values from UI to class property
  public onSubmit() {
    this.formVariable = {
      userName:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.userName)].value,
      password:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.password)].value,
      confirmPassword:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.confirmPassword)].value,
      email:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.email)].value
    }
    this.signup();
  }

  signup() {
    // Subscribe and Implement Custom Logic based on Success/Error
    this.errorMessages = [];
    var $signup = this.authenticationService.$signup(this.formVariable);
    $signup.subscribe
      (
        {
          complete: () => { this.router.navigate(['/']) },
          error: (error) => { this.signupFailed = true; this.getErrorMessages(error); }
        }
      );
  }

  getErrorMessages(error: any) {
    var errorMessages = error.error;
    if (typeof errorMessages !== 'string') {
      var errorTitles = Object.keys(errorMessages)
      errorTitles.forEach(title => {
        var test123 = errorMessages[title];
        this.errorMessages.push(...test123);
      })
    }
    else {
      var test123 = errorMessages;
      this.errorMessages.push(test123);
    }
  }

  getErrorTitles(): string[] {
    return Object.keys(this.errorMessages);
  }

  // #region Custom Async Validator
  fieldMatches(
    field: string,
    fieldCheck: string,
    bool: IBoolObject
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: boolean } | null> => {

      var fieldValue = this.form.controls[field].value;
      var fieldCheckValue = this.form.controls[fieldCheck].value;

      let isMatch : boolean;

      if (fieldValue === "" || fieldCheckValue === "") {
        isMatch = false;
      }
      else {
        isMatch = fieldValue === fieldCheckValue;
      }
      
      var isMatch$ = of(isMatch)

      // Gotta Refactor
      return isMatch$.pipe(
        map(results => {
          (results ? bool.value = results : bool.value = results);
          return (results ? null : { fieldsDoNotMatch: true });
        }));
    }
  }
  // #endregion
}

