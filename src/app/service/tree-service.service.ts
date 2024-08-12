import { Injectable } from '@angular/core';
import { PaginationMeta, PSLPlayerTree } from '../playerInterface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { response } from 'express';


const HttpOptions = {
  'headers': new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}


export interface ApiResponseTree {
  data: PSLPlayerTree[],
  meta: {
    pagination: PaginationMeta;
  };
}

export class TodoItemNode {
  children!: TodoItemNode[];
  id!: number;
  name!: string;
}


@Injectable({
  providedIn: 'root'
})
export class TreeServiceService {

  error: any | undefined;
  token = "";
  dataChanges = new BehaviorSubject<{ data: TodoItemNode[] }>({
    data: [],
  });


  get data(): { data: TodoItemNode[] } {
    return this.dataChanges.value;
  }



  constructor(private http: HttpClient) {
    this.initialize();
  }

  initialize() {
    this.getCustomApiData().subscribe((players) => {
      this.dataChanges.next({ data: players });
    });

  }

  getCustomApiData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:1337/api/tree-custom-api').pipe(
      catchError((error) => this.handleError(error)),
      map((response: any[]) => {
        return response;
      }),
    );
  }


  addNodeService(parent: Number, name: String) {
    const body = {
      "data": {
        "name": name,
        "parent": parent
      }
    };
    console.log("post", body);

    this.http.post('http://localhost:1337/api/tree-custom-api', body)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          console.log("Post", response);
          // Update the data change subject
          this.getCustomApiData().subscribe((players) => {

            this.dataChanges.next({ data: players });
          });

          // this.dataChanges.next(this.data);
        },
        error: (error) => {
          console.error('Error posting data:', error);
        }
      });
  }

  deleteNodeService(id: Number) {
    debugger
    this.http.delete(`http://localhost:1337/api/tree-custom-api/${id}`)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          console.log("Delte", response);
          // Update the data change subject
          this.getCustomApiData().subscribe((players) => {
            this.dataChanges.next({ data: players });
          });
        },
        error: (error) => {
          console.error('Error Deleting data:', error);
        }
      });
  }

  updateNodeService(name: String, id: Number) {
    const body = {
      "data": {
        "name": name,
        "parent": null
      }
    };
    // debugger

    this.http.put(`http://localhost:1337/api/tree-custom-api/${id}`, body)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          console.log("update", response);
          // Update the data change subject
          this.getCustomApiData().subscribe((players) => {
            this.dataChanges.next({ data: players });
          });
        },
        error: (error) => {
          console.error('Error Updating NOde :', error);
        }
      });
  }

  postioning(newParentID: Number, nodeToUpdatedID: Number) {

    const body = {
      "data": {
        "parent": newParentID
      }
    };
    debugger

    this.http.put(`http://localhost:1337/api/tree-custom-api/postion/${nodeToUpdatedID}`, body)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          console.log("update", response);
          // Update the data change subject
          this.getCustomApiData().subscribe((players) => {
            this.dataChanges.next({ data: players });
          });
        },
        error: (error) => {
          console.error('Error Updating NOde :', error);
        }
      });
    debugger
  }




  //i   added a  new method  and used name  sodiscarding the below method  only diffrence is id  and name 
  // getChild(id: number): Observable<any[]> {
  //   return this.getCustomApiDataID(id).pipe(
  //     map((response) => response)
  //   );
  // }

  // 


  getCustomApiDataID(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:1337/api/tree-custom-api/${id}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // :name
  // : Observable<any[]>
  getChild(name: string) {
    return this.getCustomApiDataName(name).pipe(
      map((response) => response)
    );
  }

  getCustomApiDataName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:1337/api/tree-custom-api/withname/${name}`)
      .pipe(
        catchError((error) => this.handleError(error))
      );

  }


  ///tree-custom-api/:filterData

  filterData(filterData: string) {

    this.getfilterTee(filterData).subscribe((players) => {
      console.log(players);

      this.dataChanges.next({ data: players });
    });
    debugger


  }

  getfilterTee(filterData: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:1337/api/tree-custom-api/filter/${filterData}`).pipe(
      catchError((error) => this.handleError(error))
    );

  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error.message;
    console.log(this.error);
    return of();
  }

}






// getPlayerTree(): Observable<{ players: any[]; pagination: PaginationMeta }> {
//   return this.http.get<ApiResponseTree>("http://localhost:1337/api/nodes?populate=*")
//     .pipe(
//       catchError((error) => this.handleError(error)),
//       map((response: ApiResponseTree) => {
//         const players = response.data.map(player => ({
//           ...player

//         }));
//         debugger
//         const pagination = response.meta.pagination;
//         return { players, pagination };
//       })
//     );
// }