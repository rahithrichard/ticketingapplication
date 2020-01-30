import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
//import { BackgroundMode } from '@ionic-native/background-mode';
//import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
/*
  Generated class for the GpsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GpsProvider {
  intervalHandle: any = null;
 // options: RequestOptions;
  constructor(public http: HttpClient,private geolocation: Geolocation/*private backgroundMode: BackgroundMode*/) {
    console.log('Hello GpsProvider Provider');
  }
 /* toggleInterval() {

    if (this.intervalHandle === null) {
      this.intervalHandle = setInterval(() => {
        this.callAPI();
      }, 900);
    } else {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }*/
  callAPI() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
     // this.postGPS(resp.coords.latitude,resp.coords.longitude);
    }).catch((error) =>{
      console.log('Error getting location', error);
    });
  }   
 /*  postGPS(latitude,longitude){
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
       var link = '/rt/api/v1.0/gps_logs';
       var local =JSON.parse(localStorage.getItem('userData'));
       var gps_cordinates = "latitude:"+latitude+",longitude:"+longitude;
       this.http.post(link, {gps_coordinates: gps_cordinates,user_id:local.user_id},this.options)
       .map(res => res.json())
       .subscribe(data => {
           console.log(data);

       },
        error=>{
            console.log(error);

        });
    }*/
}
