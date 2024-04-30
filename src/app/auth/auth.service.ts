import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { IUser } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly url = 'localhost:3000/auth';

  private subjUser$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
  private subjLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject (false);

  constructor(private http: HttpClient) { }

  register(user:IUser):Observable<IUser> {
    return this.http.post<IUser>(`${this.url}/register`, user)
  }

  login(credentials:{email:string, password:string}):Observable<IUser>{
  return this.http
  .post<IUser>(`${this.url}/login`, credentials)
  .pipe(
    tap((user:IUser) => {
      localStorage.setItem('token', user.token ??''
      );
      this.subjLoggedIn$.next(true);
      this.subjUser$.next([user])
    })
  )
  }

  isAuthenticate(): Observable<boolean>{
    const token = localStorage.getItem('token');

    if (token && !this.subjLoggedIn$.value ) {
      return this.checkTokenValidation();
    }
    return this.subjLoggedIn$.asObservable();
  }
  checkTokenValidation():Observable<boolean> {
    return this.http.get<IUser>(`${this.url}/user`)
    .pipe(
      tap((user: IUser) => {
        if(user){
          this.subjLoggedIn$.next(true);
          this.subjUser$.next([user])
        }

      }),
      map((user: IUser) => (user)? true:false),
      catchError((error) =>{
        this.logout();
        return of(false);
      })
    )
  }
  getUser():Observable<boolean> {
    return this.subjLoggedIn$.asObservable();
  }

  logout(){
    localStorage.removeItem('token');
    this.subjLoggedIn$.next(false);
    this.subjUser$.next([])

  }
}
