
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { PSLPlayer } from '../playerInterface';

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


export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ApiResponse {
  data: { id: number; attributes: PSLPlayer }[];
  meta: {
    pagination: PaginationMeta;
  };
}

@Injectable({
  providedIn: 'root'
})

export class PlayersService {

  error: any | undefined;
  token = "";
  dataChange = new BehaviorSubject<{ players: PSLPlayer[]; pagination: PaginationMeta }>({
    players: [],
    pagination: { page: 0, pageSize: 0, pageCount: 0, total: 0 }
  });

  constructor(private http: HttpClient) {
    this.initialize();
  }

  initialize() {
    this.getPlayer().subscribe((players) => {
      this.dataChange.next(players);
    });
  }

  // in porocess
  getPlayer(): Observable<{ players: PSLPlayer[]; pagination: PaginationMeta }> {
    return this.http
      .get<ApiResponse>("http://localhost:1337/api/psl-players?pagination[page]=1&pagination[pageSize]=5&pagination[withCount]=true", {
        params: { populate: "*" },
      })
      .pipe(
        catchError((error) => this.handleError(error)),
        map((response: ApiResponse) => {
          const players = response.data.map(player => ({
            id: player.id,
            ...player.attributes
          }));
          const pagination = response.meta.pagination;
          return { players, pagination };
        })
      );
  }

  // 
  /*
  {
    "data": [
        {
            "id": 22,
            "attributes": {
                "name": "Imad",
                "age": 23,
                "nationality": "Pakistan",
                "category": "Silver",
                "team": "islamabad",
                "createdAt": "2024-07-29T11:40:55.326Z",
                "updatedAt": "2024-07-29T11:47:12.651Z",
                "publishedAt": "2024-07-29T11:40:55.322Z",
                "type": "Batsman"
            }
        }
 "meta": {
        "pagination": {
            "page": 1,
            "pageSize": 5,
            "pageCount": 3,
            "total": 15
        }
    }
}
  */

  // getPlayer(): Observable<PSLPlayer[]> {
  //   return this.http
  //     .get<ApiResponse>("http://localhost:1337/api/psl-players?pagination[page]=1&pagination[pageSize]=5&pagination[withCount]=true", {
  //       params: { populate: "*" },
  //     })
  //     .pipe(
  //       catchError((error) => this.handleError(error)),
  //       map((response: ApiResponse) => {
  //         return response.data.map(player => ({
  //           id: player.id,
  //           ...player.attributes,

  //         }))
  //       })
  //     );
  // }



  //important__________________________________________________________
  //this   is  working fine  and get    all  data player
  // getPlayer(): Observable<PSLPlayer[]> {
  //   return this.http
  //     .get<ApiResponse>("http://localhost:1337/api/psl-players", {
  //       params: { populate: "*" },
  //     })
  //     .pipe(
  //       catchError((error) => this.handleError(error)),
  //       map((response: ApiResponse) => {
  //         return response.data.map(player => ({
  //           id: player.id,
  //           ...player.attributes
  //         }))
  //       })
  //     );
  // }

  // _________________________________________________________________
  // get data(): PSLPlayer[] {
  //   return this.dataChange.value;
  // }

  // http://localhost:1337/api/psl-players?filters[$or][0][name][$containsi]=${val}&filters[$or][1][age][$containsi]=${val}&filters[$or][2][nationality][$containsi]=${val}&filters[$or][3][category][$containsi]=${val}&filters[$or][4][team][$containsi]=${val}&filters[$or][5][type][$containsi]=${val}&sort=id

  createUser() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<AuthResponse>('http://localhost:1337/api/auth/local/register', {
      "username": "Haider12",
      "email": "haider21@strapi.io",
      "password": "1234567"
    }, { headers })
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          this.token = response.jwt;
          console.log('Full Response:', response);
          debugger;
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
  }


  loginUser() {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    this.http.post<AuthResponse>('http://localhost:1337/api/auth/local', {
      "identifier": "haider@strapi.io",
      "password": "1234567"
    }, { headers })
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          this.token = response.jwt;
          console.log('Full Response:', response);
          debugger;
        },
        error: (error) => {
          console.error('Error logging in user:', error);
        }
      });
  }

  postData(data: PSLPlayer) {
    const body = { data };
    console.log("post", body);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:1337/api/psl-players', body, { headers })
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          console.log("Post", response);
          // Update the data change subject
          this.getPlayer().subscribe((players) => {
            this.dataChange.next(players);
          });
        },
        error: (error) => {
          console.error('Error posting data:', error);
        }
      });
  }

  updateData(data: PSLPlayer) {
    const body = { data };
    console.log("put", body);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(`http://localhost:1337/api/psl-players/${data.id}`, body, { headers })
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          console.log("Update", response);
          // Update the data change subject
          this.getPlayer().subscribe((players) => {
            this.dataChange.next(players);
          });
        },
        error: (error) => {
          console.error('Error updating data:', error);
        }
      });

  }

  deleteData(idNumber: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.delete(`http://localhost:1337/api/psl-players/${idNumber}`, { headers })
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe({
        next: (response) => {
          console.log("Delete", response);
          // Update the data change subject
          this.getPlayer().subscribe((players) => {
            this.dataChange.next(players);
          });
        },
        error: (error) => {
          console.error('Error updating data:', error);
        }
      });
  }

  //Re-updating The Data
  paginationUpdating( page: number, size: number, column: string, direction: string) {
    this.paginationData(page, size, column, direction).subscribe((players) => {
      this.dataChange.next(players);
    });
    debugger
  }

  paginationData(page: number, size: number, column: string, direction: string): Observable<{ players: PSLPlayer[]; pagination: PaginationMeta }> {
    debugger
    return this.http
      .get<ApiResponse>(`http://localhost:1337/api/psl-players?pagination[page]=${page + 1}&pagination[pageSize]=${size}&pagination[withCount]=true&sort[0]=${column}:${direction}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        map((response: ApiResponse) => {
          const players = response.data.map(player => ({
            id: player.id,
            ...player.attributes
          }));
          const pagination = response.meta.pagination;
          return { players, pagination };
        })
      )

  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.error = error.message;
    console.log(this.error);
    return of();
  }


  // http://localhost:1337/api/psl-players?filters[$or][0][name][$containsi]=${val}&filters[$or][1][age][$containsi]=${val}&filters[$or][2][nationality][$containsi]=${val}&filters[$or][3][category][$containsi]=${val}&filters[$or][4][team][$containsi]=${val}&filters[$or][5][type][$containsi]=${val}&sort=id



  filterData(val: string | number, page: number, size: number, column: string, direction: string): Observable<{ players: PSLPlayer[]; pagination: PaginationMeta }> {
    return this.http
      .get<ApiResponse>(`http://localhost:1337/api/psl-players?filters[$or][0][name][$containsi]=${val}&filters[$or][1][age][$containsi]=${val}&filters[$or][2][nationality][$containsi]=${val}&filters[$or][3][category][$containsi]=${val}&filters[$or][4][team][$containsi]=${val}&filters[$or][5][type][$containsi]=${val}&pagination[page]=${page + 1}&pagination[pageSize]=${size}&pagination[withCount]=true&sort[0]=${column}:${direction}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        map((response: ApiResponse) => {
          const players = response.data.map(player => ({
            id: player.id,
            ...player.attributes
          }));
          const pagination = response.meta.pagination;
          return { players, pagination };
        })
      )
  }

  filteringData(val: string | number, page: number, size: number, column: string, direction: string) {
    debugger
    this.filterData(val, page, size, column, direction).subscribe((players) => {
      this.dataChange.next(players);
    });
    return true;
  }

  // http://localhost:1337/api/psl-players?sort[0]=id:desc&sort[1]=name:asc


  sortData(column: string, direction: string, page: number, pagesize: number) {
    debugger
    return this.http
      .get<ApiResponse>(`http://localhost:1337/api/psl-players?sort[0]=${column}:${direction}&pagination[page]=${page}&pagination[pageSize]=${pagesize}&pagination[withCount]=true`)
      .pipe(
        catchError((error) => this.handleError(error)),
        map((response: ApiResponse) => {
          const players = response.data.map(player => ({
            id: player.id,
            ...player.attributes
          }));
          const pagination = response.meta.pagination;
          return { players, pagination };
        })
      ).subscribe((players) => {
        this.dataChange.next(players);
      });
  }
}     