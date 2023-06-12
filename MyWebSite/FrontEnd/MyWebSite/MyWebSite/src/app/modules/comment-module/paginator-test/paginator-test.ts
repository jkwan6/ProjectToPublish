import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'paginator-test',
  templateUrl: './paginator-test.html',
  styleUrls: ['./paginator-test.scss']
})

export class PaginatorTest implements OnInit {

    //pageSizeOptions: number[] = [5, 10, 25, 30];      // Paginator Setup

    //// Test states
    EmitResult = { pageNumber: '', pageSize: '' };
    testPaginator = { length: 1000, pageSize: 10, pageIndex: 0 };

    //// states
    //tableData: any;

    //constructor(private httpClient: HttpClient) {
    //  this.getPageDetails();
    //}

    //setPageSizeOptions = (setPageSizeOptionsInput: string) => {
    //  if (setPageSizeOptionsInput) {
    //    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    //  }
    //}

    ngOnInit(): void {
/*      this.getPageDetails();    // initializing input properties, and the first call to ngOnChanges*/
    }


  //getPageDetails = () => {
  //  this.getPageSize().subscribe(result => {
  //    this.paginationInfo = result;
  //    this.getData(0, this.paginationInfo.pageSize);
  //  });
  //}

  //getData = (pg: any, lmt: any) => {
  //  return this.allProjects(pg, lmt).subscribe(res => {
  //    this.tableData = res;
  //  });
  //}

  //getPageSize = () => {
  //  return this.httpClient.get(`${this.BASE_URL}/pageSize`);
  //}


  //  onPageEvent = ($event: any) => {
  //    this.getData($event.pageIndex, $event.pageSize);
  //  }

    showTestEmit = ($event: any) => {
        this.EmitResult =  {
          pageNumber: $event.pageIndex,
          pageSize: $event.pageSize
        };
    }

  //  allProjects = (page: any, limit:any ) => {
  //    return this.httpClient.get(`${this.BASE_URL}/posts?_page=${page + 1}&_limit=${limit}`);
  //  }
}
