import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { ILoginRequest } from '../interface/ILoginRequest';



@Component({
  selector: 'app-log-in-sign-up',
  templateUrl: './log-in-sign-up.component.html',
  styleUrls: ['./log-in-sign-up.component.css']
})
export class LogInSignUpComponent implements OnInit {


  hide = true

  constructor(private client: HttpClient) { }

  form!: FormGroup;
  private email!: string;
  private password!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
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

    observable.subscribe(results => {
      console.log(results)
    }, error => console.error(error));

  }

  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }

  public testMethod(url: string, loginRequest : ILoginRequest): Observable<any> {
    var observable: Observable<any> = this.client.post<any>(url, loginRequest, {withCredentials : true });
    return observable;
  }

}
