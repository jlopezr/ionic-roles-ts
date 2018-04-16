import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';

interface AuthResponse {
  token: string;
}

@Injectable()
export class Auth {

  public token: any;

  constructor(public http: HttpClient, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  checkAuthentication() {
    return new Promise((resolve, reject) => {

      //Load token if exists
      this.storage.get('token').then((value) => {

        console.log("TOKEN " + this.token);

        this.token = value;

        if (this.token === null) {
          return reject();
        }

        let headers = new HttpHeaders({
          'Authorization': this.token
        });

        this.http.get('http://localhost:8080/api/auth/protected', {headers: headers})
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });

      });

    });
  }

  createAccount(details) {

    return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.post<AuthResponse>('http://localhost:8080/api/auth/register', JSON.stringify(details), {headers: headers})
        .subscribe(res => {
          this.token = res.token;
          this.storage.set('token', res.token);
          resolve(res);

        }, (err) => {
          reject(err);
        });

    });

  }

  login(credentials) {

    return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      this.http.post<AuthResponse>('http://localhost:8080/api/auth/login', JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {
          this.token = res.token;
          this.storage.set('token', res.token);
          resolve(res);
        }, (err) => {
          reject(err);
        });

    });

  }

  logout() {
    this.storage.set('token', '');
  }
}
