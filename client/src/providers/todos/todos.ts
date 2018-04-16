import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Auth} from '../auth/auth';
import 'rxjs/add/operator/map';

@Injectable()
export class Todos {

  constructor(public http: HttpClient, public authService: Auth) {

  }

  getTodos() {

    return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({
        'Authorization': this.authService.token
      });

      this.http.get('http://localhost:8080/api/todos', {headers: headers})
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });

  }

  createTodo(todo) {

    return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authService.token
      });

      this.http.post('https://localhost:8080/api/todos', JSON.stringify(todo), {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });

    });

  }

  deleteTodo(id) {

    return new Promise((resolve, reject) => {

      let headers = new HttpHeaders({
        'Authorization': this.authService.token
      });
      this.http.delete('http://localhost:8080/api/todos/' + id, {headers: headers}).subscribe((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });

    });

  }

}
