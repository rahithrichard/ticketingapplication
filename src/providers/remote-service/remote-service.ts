import { Injectable } from "@angular/core";
import { ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class CustomHttp extends Http {
   
    private host = window.location.hostname;
    private port = window.location.port;
    private apiUrl;

    //private apiUrl = 'http://'+this.host;
	//private apiUrl = 'http://demo1.yukthi.biz:8083';
    

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);

    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.apiUrl= JSON.parse(localStorage.getItem('url'));
        return super.get(this.apiUrl + url, this.addJwt(options)).catch(this.handleError);
    }
    
    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        this.apiUrl= JSON.parse(localStorage.getItem('url'));
        return super.post(this.apiUrl + url, body,this.addJwt(options)).catch(this.handleError);
    }
    postAdd(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        this.apiUrl= JSON.parse(localStorage.getItem('url'));
        return super.post(this.apiUrl + url, body, this.addJwt(options)).catch(this.handleError);
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        this.apiUrl= JSON.parse(localStorage.getItem('url'));
        return super.put(this.apiUrl + url, body, this.addJwt(options)).catch(this.handleError);
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        this.apiUrl= JSON.parse(localStorage.getItem('url'));
        return super.delete(this.apiUrl + url, this.addJwt(options)).catch(this.handleError);
    }
    // private helper methods

    private addJwt(options?: RequestOptionsArgs): RequestOptionsArgs {
        // ensure request options and headers are not null
        options = options || new RequestOptions();
        options.headers = options.headers || new Headers();
        // add authorization header with jwt token
        var userData=JSON.parse(localStorage.getItem('userData'));
        if(userData!=null){
        let currentUser = JSON.parse(localStorage.getItem('userData'));
           options.headers.append('Authorization','Bearer ' + currentUser.access_token);
           //options.headers.append('Content-Type', 'application/json'); 
            console.log(options.headers);      }              
            return options;
    }
   private handleError(error: any) {
       /*  if (error.status === 401) {
            // 401 unauthorized response so log user out of client
            window.location.href = '/login';
        }*/
        return Observable.throw(error._body);
    } 
}
export function customHttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
        console.log(window.location.hostname);
        console.log(window.location.port);
    return new CustomHttp(xhrBackend, requestOptions);
}

export let customHttpProvider = {
    provide: Http,
    useFactory: customHttpFactory,
    deps: [XHRBackend, RequestOptions]
}