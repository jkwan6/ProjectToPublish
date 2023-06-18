import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ILoginRequest } from '../../../app/interface/ILoginRequest';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  hide = true

  constructor(
    private client: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }

  form!: FormGroup;
  private email!: string;
  private password!: string;
  public loginCheck!: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    var loginOrSignUp = this.activatedRoute.toString();
    var containsLogin = loginOrSignUp.includes("login")
    this.loginCheck = (containsLogin) ? true : false;

    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.email = "string";
    this.password = "string";

  };


  public login() {
    this.email = this.form.controls['email'].value;
    this.password = this.form.controls['password'].value;
    var url: string = "api/authentication/login";

    var user: ILoginRequest;
    user = <ILoginRequest>{};
    user.email = this.email;
    user.password = this.password;

    url = this.getUrl(url);

    var observable = this.testMethod(url, user);

    observable.subscribe((results: any) => {
      console.log(results)
    }, error => console.error(error));

  }
  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }

  public testMethod(url: string, loginRequest: ILoginRequest): Observable<any> {
    var observable: Observable<any> = this.client.post<any>(url, loginRequest, { withCredentials: true });
    return observable;
  }
}
