import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BehaviorSubject, map, Observable, of, retry } from 'rxjs';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { environment } from '../../../../environments/environment.prod';
import { IComments } from '../../../interface/IComments';
import { ILoginRequest } from '../../../interface/ILoginRequest';
import { ISignUpRequest } from '../../../interface/ISignUpRequest';
import { BaseRepository } from '../../../repository/BaseRepository';
import { SharedUtils } from '../../../SharedUtils/SharedUtils';


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

  passwordHide = true                 // Property to Hide/Unhide Password
  confirmPasswordHide = true;
  formVariable!: ISignUpRequest;      // Update Type Based on Form Parameters
  form!: FormGroup;                   // ReactiveForm
  baseUrl: string;

  passwordCheck!: IBoolObject;
  emailCheck!: IBoolObject;

  constructor(
    private repository: BaseRepository<ISignUpRequest>
  ) {
    this.passwordCheck = { value: false }
    this.emailCheck = { value: false }
    this.baseUrl = "api/authentication/login"
  }

  ngOnInit(): void {
    this.InitialializeFormGroup();

  }

  // #region --> Code Module to Initialize FormGroup
  private InitialializeFormGroup() {

    this.formVariable = { email: "", password: "", confirmPassword: "", confirmEmail: "" };                  // Gotta initialize First

    this.form = new FormGroup({});

    // Add Parameters to Form Group
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.email),            // Update Property Here
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
      SharedUtils.nameof(this.formVariable, x => x.confirmEmail),  // Update Property Here
      new FormControl("", Validators.required)                        // "" To initialize empty form
    );
    this.form.controls['email'].addAsyncValidators([this.fieldMatches('email', 'confirmEmail', this.emailCheck)]);
    this.form.controls['confirmEmail'].addAsyncValidators([this.fieldMatches('email', 'confirmEmail', this.emailCheck)]);
    this.form.controls['password'].addAsyncValidators([this.fieldMatches('password', 'confirmPassword', this.passwordCheck)]);
    this.form.controls['confirmPassword'].addAsyncValidators([this.fieldMatches('password', 'confirmPassword', this.passwordCheck)]);
  }
  // #endregion

  // Assign User Values from UI to class property
  public onSubmit() {
    this.formVariable = {
      email:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.email)].value,
      password:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.password)].value,
      confirmPassword:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.confirmPassword)].value,
      confirmEmail:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.confirmEmail)].value
    }
    this.sendRequest();
  }

  sendRequest() {
    var url = environment.baseUrl + this.baseUrl;
    var $login = this.repository.PostItem(url, this.formVariable);
    $login.subscribe();
  }




  fieldMatches(
    field: string,
    fieldCheck: string,
    bool: IBoolObject
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: boolean } | null> => {
      var behaviourSubject = new BehaviorSubject<boolean>(false);

      var fieldValue = this.form.controls[field].value;
      var fieldCheckValue = this.form.controls[fieldCheck].value;

      var isMatch = fieldValue === fieldCheckValue;
      behaviourSubject.next(isMatch);


      // Gotta Refactor
      return behaviourSubject.pipe(
        map(results => {
          console.log(results);

          (results ? bool.value = results : bool.value = results);
          var x = (results ? null : { fieldsDoNotMatch: true });

          return x;
        }));
    }
  }

  private checkFieldsMatch(fieldValue: any, fieldCheckValue: any): Observable<boolean> {
    return of(fieldValue === fieldCheckValue);
  }

}

