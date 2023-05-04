import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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

  public displayedColumns: string[] = ["id", "name", "iso2", "iso3", "citiesCount"];
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;
  private username!: string;
  private password!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {

    this.username = "string";
    this.password = "string";

    var user: ILoginRequest;
    user = <ILoginRequest>{};
    user.email = this.username;
    user.password = this.password;


    var params = new HttpParams()
      .set("Email", this.username)
      .set("Password", this.password);



    var url: string = "api/authentication/login";
    url = this.getUrl(url);

    var observable = this.testMethod(url, user);

    observable.subscribe(results => { console.log(results)
    }, error => console.error(error));

  };

  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }

  public testMethod(url: string, loginRequest : ILoginRequest): Observable<any> {
    var observable: Observable<any> = this.client.post<any>(url, loginRequest);
    return observable;
  }

}
