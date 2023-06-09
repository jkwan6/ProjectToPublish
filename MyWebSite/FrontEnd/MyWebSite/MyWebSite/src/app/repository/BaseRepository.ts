import { query } from '@angular/animations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IComments } from '../interface/IComments';
import { IPageParams } from '../interface/IPageParams';

@Injectable(
//  {
//  /*  providedIn: 'root'    // Singleton bcz Injected in Root*/
//}
) // DI Decorator
export class BaseRepository<T> {

  // DI Injection
  constructor(private httpClient: HttpClient) { }

  GetAll(url: string, pageParams: IPageParams): Observable<T> {
    var params = new HttpParams()
    .set(this.nameof(pageParams, x => x.pageIndex), pageParams.pageIndex)
    .set(this.nameof(pageParams, x => x.pageSize), pageParams.pageSize)
    .set(this.nameof(pageParams, x => x.sortColumn), pageParams.sortColumn)
    .set(this.nameof(pageParams, x => x.sortOrder), pageParams.sortOrder);

    if (pageParams.filterColumn && pageParams.filterQuery) {
      params = params.set(this.nameof(pageParams, x => x.filterColumn), pageParams.filterColumn);
      params = params.set(this.nameof(pageParams, x => x.filterQuery), pageParams.filterQuery);
    }

    var queryable = this.httpClient.get<T>(url, { params });
    return queryable;
  }

  GetById(baseUrl:string, id: number): Observable<T> {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.get<T>(url);
    return queryable;
  }

  PutItem(baseUrl: string, object: T, id: number) {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.put<T>(url, object);
    return queryable;
  }

  Post(baseUrl: string, object: T): Observable<T> {
    var url = baseUrl;
    var queryable = this.httpClient.post<T>(url, object);
    return queryable;
  };


  //Delete(item: T): Observable<T>;




  // INTERNAL FUNCTION TO REPLICATE C# TYPEOF FUNCTION
  private nameof<T>(obj: T, expression: (x: { [Property in keyof T]: () => string }) => () => string): string {
    const res: { [Property in keyof T]: () => string } = {} as { [Property in keyof T]: () => string };
    Object.keys(obj).map(k => res[k as keyof T] = () => k);
    return expression(res)();
  }

}
