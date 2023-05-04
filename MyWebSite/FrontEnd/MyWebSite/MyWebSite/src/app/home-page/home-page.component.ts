import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { IComments } from '../interface/IComments';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private client: HttpClient) { }

  public displayedColumns: string[] = ["id", "name", "iso2", "iso3", "citiesCount"];
  public Comments!: IComments[];  // Generic Class from AngMat Table
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    var url: string = "api/comments";
    url = this.getUrl(url);
    var observable = this.testMethod(url);

    observable.subscribe(results => {
      var test = results;
      console.log(test);
    }, error => console.error(error));

  };

  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }

  public testMethod(url: string): Observable<any> {
    var observable: Observable<any> = this.client.get<any>(url);
    observable = observable
      .pipe(
        map((results: any) => ({...results, commentsDescription: results.commentsDescription = "zzz"})));
    return observable;
  }
}
