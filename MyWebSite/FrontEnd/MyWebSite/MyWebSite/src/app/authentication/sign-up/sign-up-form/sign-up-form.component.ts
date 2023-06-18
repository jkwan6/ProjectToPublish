import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';
import { IComments } from '../../../interface/IComments';
import { ILoginRequest } from '../../../interface/ILoginRequest';
import { ISignUpRequest } from '../../../interface/ISignUpRequest';
import { BaseRepository } from '../../../repository/BaseRepository';
import { SharedUtils } from '../../../SharedUtils/SharedUtils';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css'],
  providers: [BaseRepository]
})

export class SignUpFormComponent implements OnInit {

  hide = true                       // Property to Hide/Unhide Password
  formVariable!: ISignUpRequest;     // Update Type Based on Form Parameters
  form!: FormGroup;                 // ReactiveForm
  baseUrl: string;

  constructor(
    private repository: BaseRepository<ISignUpRequest>
  ) {
    this.baseUrl = "api/authentication/login"
  }

  ngOnInit(): void {
    this.InitialializeFormGroup();
  }

  // #region --> Code Module to Initialize FormGroup
  private InitialializeFormGroup() {

    this.formVariable = { email: "", password: "" };                  // Gotta initialize First

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
  }
  // #endregion

  // Assign User Values from UI to class property
  public onSubmit() {
    this.formVariable = {
      email:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.email)].value,
      password:
        this.form.controls[SharedUtils.nameof(this.formVariable, x => x.password)].value,
    }
    this.sendRequest();
  }

  sendRequest() {
    var url = environment.baseUrl + this.baseUrl;
    var $login = this.repository.PostItem(url, this.formVariable);
    $login.subscribe();
  }


}
