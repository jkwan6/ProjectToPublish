import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

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
}
