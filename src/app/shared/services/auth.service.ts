import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceBase } from '..';

const defaultPath = '/';

@Injectable()
export class AuthService extends ServiceBase {
  private readonly defaultUrl = this.apiUrlDomain + 'api/Auth';
  private readonly loginUrl = this.defaultUrl + '/InitSystem';
  public isLoggedIn: boolean;

  get loggedIn(): boolean {
    return true;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(
    private http: HttpClient) {
    super();
  }

  public login(param: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, param);
  }
}


