import { Component} from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
//import { LocationAccuracy } from '@ionic-native/location-accuracy';
import 'rxjs/add/operator/map';
import { ɵparseCookieValue } from '@angular/common';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    authForm: FormGroup;
    publicQlength:any=0;
    errorMessage:String;
    options: RequestOptions;
    isBrowser:boolean=false;
    usrE:any='';
    usrP:any='';
    url:any='';
    contact:any;
    private host = window.location.hostname;
    private port = window.location.port;
    private protocol = window.location.protocol;
    private apiUrl = this.protocol+'//'+this.host+':'+this.port;
   //private apiUrl = 'http://demo1.yukthi.biz:8083';
    constructor(
         public nav: NavController,
         public navParams: NavParams,
         public formBuilder: FormBuilder,
         public http: Http,
         public platform:Platform,
         private geolocation: Geolocation,
         //private locationAccuracy: LocationAccuracy,
         public locationTracker:LocationTrackerProvider) {
        if(this.platform.is('core') || this.platform.is('mobileweb')){
            this.isBrowser = true;
            //this.getPublicQueues();
          }
          else{
            if(localStorage.getItem("userValue")){
              var userD=JSON.parse(localStorage.getItem("userValue"));
              this.usrE=userD['uEmail'];
              this.usrP=userD['passW'];
              this.url=userD['url']
              console.log(userD);
            }
          }
        if (localStorage.getItem('userData')){
            if(!localStorage.getItem('url')){
                localStorage.setItem('url',JSON.stringify(this.apiUrl));
            }
          this.nav.push('DashboardPage');
          this.nav.setRoot('MenuPage');
        }
        this.authForm = formBuilder.group({
            username: [this.usrE, Validators.compose([Validators.required, Validators.minLength(8)])],
            password: [this.usrP, Validators.compose([Validators.required, Validators.minLength(8)])],
            url:[this.url]
        });
    }
    ionViewWillEnter(){
      if(this.platform.is('core') || this.platform.is('mobileweb')){
        this.getPublicQueues();
      }
      else
        this.getContact();
    }
    onSubmit(value: any): void {
        //this.locationTracker.initBackgroundGeo2("true");
        if(this.authForm.valid) {
            let headers: any = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            this.options = new RequestOptions({ headers: headers });
            var link = '/login';
                var jsonObject =[];
                //var data = JSON.stringify();
                if(!this.isBrowser){
                if(typeof value.url!='undefined' && value.url ){
                    localStorage.setItem('url',JSON.stringify(value.url));
                }
                else
                    localStorage.setItem('url',JSON.stringify('http://demo1.yukthi.biz:8083'));
                    //localStorage.setItem('url',JSON.stringify('http://demo1.totaloffice.co.in'));
                }
                else{
                  //localStorage.setItem('url',JSON.stringify(this.apiUrl));
                   localStorage.setItem('url',JSON.stringify('http://demo1.yukthi.biz:8083'));
                  //localStorage.setItem('url',JSON.stringify('https://demo1.totaloffice.co.in'));
                  //localStorage.setItem('url',JSON.stringify('http://werner.yukthi.biz'));
              }
                var userDetails={
                  uEmail:value.username,
                  passW:value.password,
                  url:value.url,
                }
                localStorage.setItem("userValue", JSON.stringify(userDetails));
                console.log();
                  this.http.post(link, 'email='+value.username+'&password='+value.password,this.options )
                 .map(res => res.json())
                 .subscribe(data => {
                  console.log(data);
                  this.nav.push('DashboardPage');
                  this.nav.setRoot('MenuPage');
                 localStorage.setItem('userData',JSON.stringify(data));
                 //this.locationTracker.trackPosition();
                 if(this.isBrowser){
                  this.geolocation.getCurrentPosition().then((resp) => {
                    console.log(resp.coords.latitude);
                    console.log(resp.coords.longitude);
                    this.postGPS(resp.coords.latitude,resp.coords.longitude);
                   },error => {
                      console.log('Error getting location', error);
                   });
                  }
                  //else{
                   // this.locationTracker.stopTracking();
                   // this.locationTracker.startBackgroundGeo();
                  //}
                },error => {
                  this.errorMessage = "Invalid username or password";
                });
             }
    }
    getContact(){
        //localStorage.setItem('url',JSON.stringify(this.apiUrl));
        localStorage.setItem('url',JSON.stringify('http://demo1.yukthi.biz:8083'));
      var  link = '/rt/api/v1.0/click_to_call ';
      //console.log(link);
          this.http.get(link)
      .map(res => res.json())
      .subscribe(data =>{
        console.log(data);
        this.contact=data.call_link;
        console.log(this.contact);
      },  error => {
          console.log("Oooops!"+error);
      });
      }
    getPublicQueues(){
      //localStorage.setItem('url',JSON.stringify(this.apiUrl));
      localStorage.setItem('url',JSON.stringify('http://demo1.yukthi.biz:8083'));
    var  link = '/rt/api/v1.0/public_queues';
        this.http.get(link)
    .map(res => res.json())
    .subscribe(data =>{
      console.log(data);
      this.publicQlength=data['public_queue_list'].filter(x=>x.bool_public==true).length;
      console.log(this.publicQlength);
    },  error => {
        console.log("Oooops!"+error);
    });
    }
    afterSubmit(){
      this.nav.push('UseUrlPage');
    }
    postGPS(lat,long){
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
       var link = '/rt/api/v1.0/gps_logs';
       var local =JSON.parse(localStorage.getItem('userData'));
       var gps_cordinates = "latitude:"+lat+",longitude:"+long;
       var t1=new Date();
       var t2 = new Date(t1.setMinutes(t1.getMinutes()+330)).toISOString().substr(0,16);
       var myobj={
        gps_coordinates:gps_cordinates,
        user_id:local.user_id,
        up_date:t2,
       }
       var gpsArr=[];
       gpsArr.push(myobj);
       this.http.post(link,gpsArr,this.options)
       .map(res => res.json())
       .subscribe(data => {
           console.log(data);
       },
        error=>{
            console.log(error);
        });
    }
}
