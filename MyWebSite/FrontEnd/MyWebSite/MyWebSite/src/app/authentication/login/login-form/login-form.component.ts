import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { IComments } from '../../../interface/IComments';
import { ILoginRequest } from '../../../interface/ILoginRequest';
import { ILoginResult } from '../../../interface/ILoginResult';
import { BaseRepository } from '../../../repository/BaseRepository';
import { AuthStateService } from '../../../service/AuthStateService/AuthStateService';
import { SharedUtils } from '../../../SharedUtils/SharedUtils';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [BaseRepository]
})
export class LoginFormComponent implements OnInit {

  hide = true                       // Property to Hide/Unhide Password
  formVariable!: ILoginRequest;     // Update Type Based on Form Parameters
  form!: FormGroup;                 // ReactiveForm
  baseUrl: string;

  constructor(
    private repository: BaseRepository<ILoginRequest>,
    private authStateService: AuthStateService,
    private router: Router
  )
  {
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
    $login.subscribe((results: any) => {
      var castedResults = results as ILoginResult;
      localStorage.setItem("token", castedResults.token);
      this.authStateService.localStoragePresent.next(true);
      this.router.navigate(['/']);
    });
  }


}
