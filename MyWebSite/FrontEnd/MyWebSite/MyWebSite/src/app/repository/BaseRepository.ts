import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IPageParams } from '../interface/IPageParams';

// Generic Abstract Class
export class BaseRepository<T> {

  // DI Injection
  constructor(private url: string, protected httpClient: HttpClient) { }

  GetAll(pageParams: IPageParams): any {

    var params = new HttpParams();
    params.set(typeof (pageParams.pageIndex), pageParams.pageIndex);
    params.set(typeof (pageParams.pageSize), pageParams.pageSize);
    params.set(typeof (pageParams.sortColumn), pageParams.sortColumn);
    params.set(typeof (pageParams.sortOrder), pageParams.sortOrder);

    if (pageParams.filterColumn && pageParams.filterQuery) {
      params.set(typeof (pageParams.filterColumn), pageParams.filterColumn);
      params.set(typeof (pageParams.filterQuery), pageParams.filterQuery);
    }

    var queryable = this.httpClient.get<T>(this.url, { params });

    queryable.subscribe(result => {
      this.paginator.length = result.count;
      this.paginator.pageIndex = result.pageIndex;
      this.paginator.pageSize = result.pageSize;
      this.Cities = new MatTableDataSource<ICity>(result.data);
    }, error => console.error(error));

  }


  GetById(id: number): Observable<T>;


  Put(item: T): Observable<T>;


  Post(item: T): Observable<T>;


  Delete(item: T): Observable<T>;



}
