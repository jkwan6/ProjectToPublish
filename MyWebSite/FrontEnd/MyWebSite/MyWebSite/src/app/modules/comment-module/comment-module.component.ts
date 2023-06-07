import { HttpClient, HttpParams } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IApiObject } from '../../interface/IApiObject';
import { IComments } from '../../interface/IComments';
import { IPageParams } from '../../interface/IPageParams';
import { BaseRepository } from '../../repository/BaseRepository';


@Component({
  selector: 'app-comment-module',
  templateUrl: './comment-module.component.html',
  styleUrls: ['./comment-module.component.css'],
  providers: [BaseRepository]
})
export class CommentModuleComponent implements OnInit {

  constructor(
    private client: HttpClient,
    private repository: BaseRepository<IApiObject<IComments[]>>
  ) {
    this.commentRepo$ = this.repository.GetAll("url", this.params)
  }

  commentRepo$: Observable<IApiObject<IComments[]>>

  // Setting Default Values
  params: IPageParams =
    {
      pageIndex : 0,
      pageSize: 5,
      filterColumn: "Author",
      sortColumn: "Author",
      sortOrder: "asc",
      filterQuery: ""
    }


  // Angular Material Table Setup
  public displayedColumns: string[] = ["test"];       // Not sure why we need that
  public Comments!: MatTableDataSource<IComments>;    // Generic Class from AngMat Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  ngOnInit(): void {
    var url: string = "api/comments"; // Gotta Refactor

    url = this.getUrl(url);

    this.loadData();
  };


  loadData(query?: string) {
    var pageEvent = new PageEvent(); // Class from Paginator
    pageEvent.pageIndex = this.params.pageIndex;
    pageEvent.pageSize = this.params.pageSize;


    var url: string = "api/comments";
    url = this.getUrl(url);
    var obs = this.repository.GetAll(url, this.params);
    obs.subscribe(results => {
      this.paginator.length = results.result.count;
      this.Comments = new MatTableDataSource<IComments>(results.result.objects);
    })


  }

  getData(event: PageEvent) {
    var sortColumn = (this.sort)
      ? this.sort.active : this.params.sortColumn;      // Active is the Current string
    var sortOrder = (this.sort)
      ? this.sort.direction : this.params.sortOrder;    // Direction is Ascending/Descending
    var filterQuery = (this.params.filterQuery)
      ? this.params.filterQuery : null;
    var filterColumn = (this.params.filterColumn)
      ? this.params.filterColumn : null;

    this.params.sortOrder = sortOrder;
    this.params.sortColumn = sortColumn;
    this.params.filterQuery = (filterQuery) ? filterQuery : "";
    this.params.sortColumn = filterColumn ? filterColumn : "";
    this.params.pageSize = this.paginator.pageSize;
    this.params.pageIndex = this.paginator.pageIndex;


    var url: string = "api/comments";
    url = this.getUrl(url);

    var obs = this.repository.GetAll(url, this.params);
    obs.subscribe(results => {
      this.paginator.length = results.result.count;
      this.paginator.pageIndex = this.params.pageIndex;
      this.paginator.pageSize = this.params.pageSize;
      this.Comments = new MatTableDataSource<IComments>(results.result.objects);
    })
  }














  // Private Method
  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }
}
