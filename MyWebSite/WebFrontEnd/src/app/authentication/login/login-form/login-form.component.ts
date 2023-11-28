import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IComments } from '../../../interface/IComments';
import { ILoginRequest } from '../../../interface/ILoginRequest';
import { ILoginResult } from '../../../interface/ILoginResult';
import { BaseRepository } from '../../../repository/BaseRepository';
import { AuthenticationService } from '../../../service/AuthenticationService/AuthenticationService';
import { SharedUtils } from '../../../shared-utils/SharedUtils';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [BaseRepository]
})
export class LoginFormComponent implements OnInit {

  private client_id = "MyWebsite";
  private scope = "offline_access";
  private grant_type = "password";

  hide = true                       // Property to Hide/Unhide Password
  formVariable!: ILoginRequest;     // Update Type Based on Form Parameters
  form!: FormGroup;                 // ReactiveForm
  loginFailed!: boolean;
  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router){}

  ngOnInit(): void {
    this.InitialializeFormGroup();
  }
  // #region --> Code Module to Initialize FormGroup
  private InitialializeFormGroup() {

    this.formVariable =
    {
      client_id: this.client_id,
      scope: this.scope,
      grant_type: this.grant_type,
      username: "",
      password: ""
    };                  // Gotta initialize First
    this.form = new FormGroup({});

    // Add Parameters to Form Group
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.username),            // Update Property Here
      new FormControl("", Validators.required)                        // "" To initialize empty form
    );
    this.form.addControl(
      SharedUtils.nameof(this.formVariable, x => x.password),         // Update Property Here
      new FormControl("", Validators.required)                        // "" To initialize empty form
    );
  }
  // #endregion

  // Assign User Values from UI to class property
  public onSubmit() {
    this.formVariable = {
      client_id: this.client_id,
      scope: this.scope,
      grant_type: this.grant_type,
      username:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.username)].value,
      password:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.password)].value,
    }
    this.login();
  }

  login() {
    var $login = this._authenticationService.$login(this.formVariable);
    // Subscribe and Implement Custom Logic based on Success/Error
    $login.subscribe(() => {
      this._router.navigate(['/']);
    }, (error) => {
      this.loginFailed = true;
    });
  }


}
