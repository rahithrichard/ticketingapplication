import { Injectable,NgZone } from '@angular/core';
import { AlertController,LoadingController,App} from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import 'rxjs/add/operator/filter';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import { Platform } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { HomePage } from '../../pages/home/home';
@Injectable()
export class LocationTrackerProvider {
  logs:any= [];
  dashLog:any=[];
  loading:any;
  //public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  //public stopLoc:boolean=false;
  options: RequestOptions;

  constructor(public zone: NgZone,public _app:App,
              public backgroundGeolocation: BackgroundGeolocation,
              public geolocation:Geolocation,
              public http: Http,
              public platform:Platform,
              /*public loadingController:LoadingController,*/
              private backgroundMode: BackgroundMode,
              private alertCtrl: AlertController,
              private locationAccuracy: LocationAccuracy) {

  }
  /*startTracking() {
    this.platform.ready().then(() => {
    this.backgroundMode.on("activate").subscribe(() => {
      console.log("activated");
      setInterval(this.trackPosition,900000);
    });this.backgroundMode.enable();});
  }
  st=()=>{
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);

      this.postGPS(resp.coords.latitude,resp.coords.longitude);
     },error => {
       console.log('Error getting location', error);
     });
  }*/
 trackPosition(){
  const config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 1,
    distanceFilter: 5,
    debug: false, 
    locationProvider: 1,
    stopOnTerminate: false,
    interval: 900000,
    fastestInterval: 900000,
    activitiesInterval: 900000,
    startForeground: true,
    stopOnStillActivity:false,
    pauseLocationUpdates: false,
 // startOnBoot:true,
    activityType: 'AutomotiveNavigation',
 // maxLocations:10000    
  
  };
  this.backgroundGeolocation.configure(config).subscribe((location: BackgroundGeolocationResponse) => {
     
    console.log(location);
   // this.logs.push(`${location.latitude},${location.longitude},${new Date().getHours()},${new Date().getMinutes()}`);
     var today=new Date().getHours();
     console.log(today);
     if (today >= 7 && today<19){

   this.zone.run(() => {

      this.lat = location.latitude;
      this.lng = location.longitude;
      var t1=new Date();
      var t2 = new Date(t1.setMinutes(t1.getMinutes()+330)).toISOString().substr(0,16);
      var local =JSON.parse(localStorage.getItem('userData'));
      console.log(t2);
      var myObj = {
        gps_coordinates:"latitude:"+this.lat+",longitude:"+this.lng,
        user_id:local.user_id,
        up_date:t2,
    }
    var len;
    len=JSON.parse(localStorage.getItem("saved"));
    if(len==null){
      this.logs.push(myObj);
      localStorage.setItem("saved", JSON.stringify(this.logs));
     // this.postGPS();
    }
    else{
      len.push(myObj);
    localStorage.setItem("saved", JSON.stringify(len));
    }
    this.postGPS();
    var len2=JSON.parse(localStorage.getItem("dashLog"));
    if(len2==null){
      this.dashLog.push(myObj);
      localStorage.setItem("dashLog", JSON.stringify(this.dashLog))
    }
    else{
      len2.push(myObj);
    localStorage.setItem("dashLog", JSON.stringify(len2));
    }
    });
  }
  else{
    this.stopTracking();

  }
    },error=>{
      this.presentAlert('Error getting location'+JSON.parse(error).message);
      console.log('Error getting location', error);
 });
this.backgroundGeolocation.start();
  }
 startBackgroundGeo(){
    this.backgroundGeolocation.isLocationEnabled()
    .then((rta) =>{
      if(rta){
        this.trackPosition();
      }else {
       // this.backgroundGeolocation.showLocationSettings();
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {

            if(canRequest){
              // the accuracy option will be ignored by iOS
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () =>{ console.log('Request successful');
                this.trackPosition();},
                error => {console.log('Error requesting location permissions', error);
                this.presentAlert('App is not tracking location because system location is not enabled,  if you want to track location please enable the your system location and restart the app ');
              }
              );
            }
          
          }); 
      }
    });
  }
    postGPS(){
      var gpslogs= JSON.parse(localStorage.getItem("saved"));
      console.log(gpslogs);

      //this.presentAlert(gpslogs);
        let headers: any = new Headers();
        headers.append('Content-Type', 'application/json');
        this.options = new RequestOptions({ headers: headers });
           var link = '/rt/api/v1.0/gps_logs';
          this.http.post(link,gpslogs,this.options)
           .map(res => res.json())
           .subscribe(data => {
           // if(index==leng-1){
              this.logs=[];
              localStorage.removeItem("saved"); 
              this.dashLog=[]; 
            // }
               console.log(data);
           },
            error=>{
             // if(index<1){
              if(JSON.parse(error).msg!=undefined){
                if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
                  this.presentAlert(JSON.parse(error).msg+"your gps tracking has stopped please logout then login");
                  localStorage.removeItem("saved"); 
                  this.stopTracking();
                } 
                else{
                  this.presentAlert(JSON.parse(error).msg);
                }
                console.log(error);
              }
              else{
                this.presentAlert(JSON.parse(error).message);
                console.log("Oooops!"+error);
              }}
            );
    }
  goToLogin(){
    localStorage.removeItem('userData');
    sessionStorage.clear();
    if(!(this.platform.is('core') || this.platform.is('mobileweb'))){
      this.stopTracking();
    }
    this._app.getRootNav().setRoot(HomePage);
  }
stopTracking() {
    console.log('stopTracking');
    this.backgroundGeolocation.stop();
  }
  presentAlert(message){
    let alert = this.alertCtrl.create({
    subTitle: message,
    buttons: ['OK']
  });
  alert.present();
}
}