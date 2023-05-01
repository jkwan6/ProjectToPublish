import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { IComments } from '../interface/IComments';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  public displayedColumns: string[] = ["id", "name", "iso2", "iso3", "citiesCount"];
  public Comments!: MatTableDataSource<IComments>;  // Generic Class from AngMat Table
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.loadData();
  }

  loadData(query?: string) {
    this.getData();
  }

  getData() {
    var observable = this.getDataLogic();
    observable.subscribe(result => {
      this.Comments = new MatTableDataSource<IComments>();
    }, error => console.error(error));
  }

  getDataLogic(): Observable<IComments>    // RETURN THIS TYPE
  {
    var url = this.getUrl('api/comments');
    return this.http.get<IComments>(url);
  }
  protected getUrl(url: string) {
    return environment.baseUrl + url;
  }
}
