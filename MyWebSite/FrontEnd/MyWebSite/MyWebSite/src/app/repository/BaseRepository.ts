import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IPageParams } from '../interface/IPageParams';

@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
}) // DI Decorator
export class BaseRepository<T> {

  // DI Injection
  constructor(private httpClient: HttpClient) { }

  queryResults: any;


  GetAll(url: string, pageParams: IPageParams): any {

    var params = new HttpParams()
    .set(nameof(pageParams, x => x.pageIndex), pageParams.pageIndex)
    .set(nameof(pageParams, x => x.pageSize), pageParams.pageSize)
    .set(nameof(pageParams, x => x.sortColumn), pageParams.sortColumn)
    .set(nameof(pageParams, x => x.sortOrder), pageParams.sortOrder);

    if (pageParams.filterColumn && pageParams.filterQuery) {
      params = params.set(nameof(pageParams, x => x.filterColumn), pageParams.filterColumn);
      params = params.set(nameof(pageParams, x => x.filterQuery), pageParams.filterQuery);
    }

    var queryable = this.httpClient.get<any>(url, { params });

    let queryResult;

    queryable.subscribe(result => {
      this.queryResults = result;

      return this.queryResults;
    }, error => console.error(error));


    function nameof<T>(obj: T, expression: (x: { [Property in keyof T]: () => string }) => () => string): string {
      const res: { [Property in keyof T]: () => string } = {} as { [Property in keyof T]: () => string };
      Object.keys(obj).map(k => res[k as keyof T] = () => k);
      return expression(res)();
    }

  }


  //GetById(id: number): Observable<T>;


  //Put(item: T): Observable<T>;


  //Post(item: T): Observable<T>;


  //Delete(item: T): Observable<T>;



}
