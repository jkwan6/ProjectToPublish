import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { IComments } from '../../interface/IComments';
import { IPageParams } from '../../interface/IPageParams';
import { BaseRepository } from '../../repository/BaseRepository';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [BaseRepository]
})
export class HomePageComponent implements OnInit {

  constructor(private client: HttpClient, private repository: BaseRepository<IComments[]>) { }

  public displayedColumns: string[] = ["id", "commentsDescription", "commentsTime"];
  public Comments!: IComments[];  // Generic Class from AngMat Table
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;

  public pageParams!: IPageParams;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    var url: string = "api/comments";
    url = this.getUrl(url);
/*    var observable = this.testMethod(url);*/

//    observable.subscribe(results => {
//      var test = results;
//      this.Comments = test
///*      console.log(this.Comments);*/
//    }, error => console.error(error));

    console.log(this.Comments)

    const y: IPageParams = {
      pageSize: "5",
      filterColumn : "",
      filterQuery : "",
      sortColumn : "author",
      sortOrder : "asc",
      pageIndex: "0"
    };


    var obs = this.repository.GetAll(url, y);
    obs.subscribe(results => {
      var x = results;
      this.Comments = x;
    })

  };

  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }

  public testMethod(url: string): Observable<IComments[]> {
    var observable: Observable<IComments[]> = this.client.get<IComments[]>(url);
    return observable;
  }
}
