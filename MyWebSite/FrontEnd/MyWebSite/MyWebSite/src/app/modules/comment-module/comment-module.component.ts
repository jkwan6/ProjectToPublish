import { HttpClient, HttpParams } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IComments } from '../../interface/IComments';
import { IPageParams } from '../../interface/IPageParams';


@Component({
  selector: 'app-comment-module',
  templateUrl: './comment-module.component.html',
  styleUrls: ['./comment-module.component.css']
})
export class CommentModuleComponent implements OnInit {

  constructor(private client: HttpClient) { }


  Params: IPageParams | any =
    {
      pageIndex : "0",
      pageSize: "10",
      filterColumn: "Author",
      sortColumn: "Author",
      sortOrder: "asc",
      filterQuery: ""
    }


  // Angular Material Table Setup
  public displayedColumns: string[] = ["id", "author", "commentsDescription", "commentsTime"];
  public Comments!: MatTableDataSource<IComments>;   // Generic Class from AngMat Table
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "Author";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "Author";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // Load Data
  // Create a Page Event
  // Get Data
  ngOnInit(): void {
    var url: string = "api/comments";

    let paramsTest = new HttpParams();
    for (var key in this.Params) {
      if (this.Params.hasOwnProperty(key)) {
        paramsTest = paramsTest.set(key, this.Params[key]);
      }
    }

    url = this.getUrl(url);
    var observable = this.testMethod(url, paramsTest);

    observable.subscribe(results => {
      var test = results;
      this.Comments = new MatTableDataSource<IComments>(results);
      console.log(this.Comments);
    }, error => console.error(error));

  };


  loadData(query?: string) {
    var pageEvent = new PageEvent(); // Class from Paginator
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
  }

  getData(event: PageEvent) {
    var sortColumn = (this.sort)
      ? this.sort.active : this.Params.sortColumn;      // Active is the Current string
    var sortOrder = (this.sort)
      ? this.sort.direction : this.Params.sortOrder;    // Direction is Ascending/Descending
    var filterQuery = (this.Params.filterQuery)
      ? this.Params.filterQuery : null;
    var filterColumn = (this.Params.filterColumn)
      ? this.Params.filterColumn : null;



    var url: string = "api/comments";
    url = this.getUrl(url);

    let paramsTest = new HttpParams();
    for (var key in this.Params) {
      if (this.Params.hasOwnProperty(key)) {
        paramsTest = paramsTest.set(key, this.Params[key]);
      }
    }
    var observable = this.testMethod(url, paramsTest);

    observable.subscribe(results => {
      this.paginator.length = results.length;
      this.Comments = new MatTableDataSource<IComments>(results);
    }, error => console.error(error));
  }



  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }

  public testMethod(url: string, params: any): Observable<IComments[]> {
    var observable: Observable<IComments[]> = this.client.get<IComments[]>(url, {params});
    return observable;
  }
}
