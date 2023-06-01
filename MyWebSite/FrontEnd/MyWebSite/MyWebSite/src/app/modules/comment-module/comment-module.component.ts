import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IComments } from '../../interface/IComments';

@Component({
  selector: 'app-comment-module',
  templateUrl: './comment-module.component.html',
  styleUrls: ['./comment-module.component.css']
})
export class CommentModuleComponent implements OnInit {

  constructor(private client: HttpClient) { }

  public displayedColumns: string[] = ["id"];
  public Comments!: IComments[];  // Generic Class from AngMat Table
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "Author";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "Author";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    var url: string = "api/comments";
    url = this.getUrl(url);
    var observable = this.testMethod(url);

    observable.subscribe(results => {
      var test = results;
      this.Comments = test
      console.log(this.Comments);
    }, error => console.error(error));

  };

  public getUrl(url: string): string {
    return environment.baseUrl + url;
  }

  public testMethod(url: string): Observable<IComments[]> {
    var observable: Observable<IComments[]> = this.client.get<IComments[]>(url);
    return observable;
  }
}
