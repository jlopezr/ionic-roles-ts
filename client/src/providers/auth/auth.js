var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
var AuthProvider = /** @class */ (function () {
    function AuthProvider(http, storage) {
        this.http = http;
        this.storage = storage;
        console.log('Hello AuthProvider Provider');
    }
    AuthProvider.prototype.checkAuthentication = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //Load token if exists
            _this.storage.get('token').then(function (value) {
                console.log("TOKEN " + _this.token);
                _this.token = value;
                var headers = new HttpHeaders({
                    'Authorization': _this.token
                });
                _this.http.get('http://localhost:8080/api/auth/protected', { headers: headers })
                    .subscribe(function (res) {
                    console.log("CASE 1");
                    resolve(res);
                }, function (err) {
                    console.log("CASE 2");
                    reject(err);
                });
            });
        });
    };
    AuthProvider.prototype.createAccount = function (details) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
            _this.http.post('http://localhost:8080/api/auth/register', JSON.stringify(details), { headers: headers })
                .subscribe(function (res) {
                _this.token = res.token;
                _this.storage.set('token', res.token);
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    };
    AuthProvider.prototype.login = function (credentials) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
            _this.http.post('http://localhost:8080/api/auth/login', JSON.stringify(credentials), { headers: headers })
                .subscribe(function (res) {
                _this.token = res.token;
                _this.storage.set('token', res.token);
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    };
    AuthProvider.prototype.logout = function () {
        this.storage.set('token', '');
    };
    AuthProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Storage])
    ], AuthProvider);
    return AuthProvider;
}());
export { AuthProvider };
//# sourceMappingURL=auth.js.map