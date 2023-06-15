import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { IPageParams } from '../interface/IPageParams';
import { SharedUtils } from '../SharedUtils/SharedUtils';

@Injectable() // DI Decorator
export class BaseRepository<T> {

  // DI Injection
  constructor(private httpClient: HttpClient) { }

  GetAll(url: string, pageParams: IPageParams): Observable<T> {
    var params = new HttpParams()
      .set(SharedUtils.nameof(pageParams, x => x.pageIndex), pageParams.pageIndex)
      .set(SharedUtils.nameof(pageParams, x => x.pageSize), pageParams.pageSize)
      .set(SharedUtils.nameof(pageParams, x => x.sortColumn), pageParams.sortColumn)
      .set(SharedUtils.nameof(pageParams, x => x.sortOrder), pageParams.sortOrder);

    if (pageParams.filterColumn && pageParams.filterQuery) {
      params = params.set(SharedUtils.nameof(pageParams, x => x.filterColumn), pageParams.filterColumn);
      params = params.set(SharedUtils.nameof(pageParams, x => x.filterQuery), pageParams.filterQuery);
    }

    var queryable = this.httpClient.get<T>(url, { params });
    return queryable;
  }

  GetById(baseUrl:string, id: number): Observable<T> {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.get<T>(url);
    return queryable;
  }

  PutItem(baseUrl: string, object: T, id: number): Observable<T> {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.put<T>(url, object);
    return queryable;
  }

  PostItem(baseUrl: string, object: T): Observable<T> {
    var url = baseUrl;
    var queryable = this.httpClient.post<T>(url, object);
    return queryable;
  };

  DeleteItem(baseUrl: string, id: number): Observable<T> {
    var url = baseUrl + "/" + id;
    var queryable = this.httpClient.delete<T>(url);
    return queryable;
  }

}
