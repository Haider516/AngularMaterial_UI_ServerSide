import { Injectable } from '@angular/core';
import { PaginationMeta, PSLPlayerTree } from '../playerInterface';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';


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
  data:  PSLPlayerTree[],
  meta: {
    pagination: PaginationMeta;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TreeServiceService {

  error: any | undefined;
  token = "";
  dataChange = new BehaviorSubject<{ players: PSLPlayerTree[]; pagination: PaginationMeta }>({
    players: [],
    pagination: { page: 0, pageSize: 0, pageCount: 0, total: 0 }
  });

  constructor(private http: HttpClient) {
    this.initialize();
  }

  initialize() {
    this.getPlayerTree().subscribe((players) => {
      this.dataChange.next(players);
    });
  }



  getPlayerTree(): Observable<{ players: PSLPlayerTree[]; pagination: PaginationMeta }> {
    return this.http
      .get<ApiResponseTree>("http://localhost:1337/api/psl-players?pagination[page]=1&pagination[pageSize]=5&pagination[withCount]=true")
      .pipe(
        catchError((error) => this.handleError(error)),
        map((response: ApiResponseTree) => {
          const players = response.data.map(player => ({
            ... player
            
          }));
          debugger
          const pagination = response.meta.pagination;
          return { players, pagination };
        })
      );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error.message;
    console.log(this.error);
    return of();
  }

}
