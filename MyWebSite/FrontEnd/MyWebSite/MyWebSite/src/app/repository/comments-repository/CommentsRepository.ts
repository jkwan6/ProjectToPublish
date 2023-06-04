import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IComments } from "../../interface/IComments";
import { BaseRepository } from "../BaseRepository";

enum ModelBinding {
  pageIndex = "pageIndex",
  pageSize = "pageSize",
  sortColumn = "sortColumn",
  sortOrder = "sortOrder",
  filterColumn = "filterColumn",
  filterQuery = "filterQuery"
}

@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class CommentsRepository extends BaseRepository<IComments>{

  GetAll() {
      throw new Error("Method not implemented.");
  }
  GetById(id: number): Observable<any> {
      throw new Error("Method not implemented.");
  }
  Put(item: any): Observable<any> {
      throw new Error("Method not implemented.");
  }
  Post(item: any): Observable<any> {
      throw new Error("Method not implemented.");
  }
  Delete(item: any): Observable<any> {
      throw new Error("Method not implemented.");
  }


  constructor(private http: HttpClient) { super(http); }



}
