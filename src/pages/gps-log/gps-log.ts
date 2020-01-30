import { Component,ViewChild,Input,OnInit} from '@angular/core';
import { IonicPage, NavController,AlertController, NavParams,LoadingController,Platform } from 'ionic-angular';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
//import { LocationAccuracy } from '@ionic-native/location-accuracy';
//import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';
import { map } from 'rxjs/operators';

//import { AlertController,} from 'ionic-angular';*/

@IonicPage()
@Component({
  selector: 'page-gps-log',
  templateUrl: 'gps-log.html',
  
})
export class GpsLogPage implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() zoom: number = 16;
  displayedColumns:string[]=['full_name','up_date','gps_coordinates'];
  authForm: FormGroup;
  lat: number;
  lng: number;
  gpsShow:boolean=false;
  validity:boolean=false;
  completeLog:any=[];
  reqDate = new Date();
  dataSource:any=[];
  dashLogs: any=[];
  logs:any=[];
  subUsers:any;
  isBrowser:boolean=false;
  constructor(public locationTracker:LocationTrackerProvider,public platform: Platform,
    private alertCtrl: AlertController,
    public http: Http,
    public formBuilder: FormBuilder,
    public loadingController:LoadingController) {
      if(this.platform.is('core') || this.platform.is('mobileweb')){
        this.isBrowser = true;
      }
      var req=new Date(this.reqDate.getTime() - (this.reqDate.getTimezoneOffset() * 60000)).toISOString().substr(0,16);
      this.authForm = formBuilder.group({
        //	from_datetime: [new Date(),[Validators.required]],
       from_datetime:[req,[Validators.required]],
          end_date: [req,[Validators.required]],
          user:['',[Validators.required]]
        });
    this.gpsSubgoup();
    this.dashLogs=JSON.parse(localStorage.getItem("dashLog"));
    this.logs=JSON.parse(localStorage.getItem("saved"));
    console.log(this.logs);
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.refreshData(this.dataSource); 
  }
  refreshData(data:any[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
}
timeFormat(c){
    var t=(c.slice(0,10)).split("-").reverse().join("/")+" T "+c.slice(11,16);
    //console.log(t);
    return t ;
  }
  onSubmit(value): void {
    this.validity=true;
    let formData=new FormData();
    formData.append('from_datetime',value.from_datetime.substr(0,16)); 	
    formData.append('user_id',value.user);
      formData.append('end_date',value.end_date.substr(0,16));
  var link = '/rt/api/v1.0/users/gps_logs_list';
  this.http.post(link,formData).pipe(map((response:any)=>response.json()))
  .subscribe(data => {
      console.log(data);
      if(data['gps_logs']==0)
      {
        this.presentAlert("No gps data found in this range");
         this.validity=false;
      }
      
      else
        this.completeLog=data['gps_logs'];
        console.log(this.completeLog);
      //var myDate = new Date(this.completeLog[0].up_date);
      //console.log(myDate.toLocaleString());
      this.refreshData(this.completeLog);
      //form.resetForm();
  },  error => {
    this.presentAlert(JSON.parse(error).message)
       console.log("Oooops!"+error);
  });
  }
  gpsLocation(gps){
    var arr = gps.split(",").map(String);
    console.log(arr[1].split(":")[1]);
    this.gpsShow=!this.gpsShow;
    this.lat=(Number)(arr[0].split(":")[1]);
    this.lng=(Number)(arr[1].split(":")[1]);
    console.log(this.lat);
  }
  gmtToLocal(update){
    var myDate = new Date(update);
    //var a=new Date(value.fromDate.toISOString().substr(0,16));
    var a=new Date(myDate.setMinutes(myDate.getMinutes()+330)).toISOString().substr(0,16);
    return a;

   }
  update(){
    this.dashLogs=JSON.parse(localStorage.getItem("dashLog"));
    this.logs=JSON.parse(localStorage.getItem("saved"));
}
sendData(){
  //this.locationTracker.postGPS();
  this.dashLogs=JSON.parse(localStorage.getItem("dashLog"));
  this.logs=JSON.parse(localStorage.getItem("saved"));
}
gpsSubgoup(){
  var link = '/rt/api/v1.0/groups/my_grp_user_list';
  this.http.get(link)
  .map(res => res.json())
  .subscribe(data => {
    this.subUsers=data['my_grp_user_list'];
   console.log(this.subUsers);
  }, error => {
    if(JSON.parse(error).msg!=undefined){
      if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
        this.presentAlert(JSON.parse(error).msg+" Redirecting to login page");
        this.locationTracker.goToLogin();
      } 
      else{
        this.presentAlert(JSON.parse(error).msg);
      }
      console.log(JSON.parse(error));
    }
    else{
      this.presentAlert(JSON.parse(error).message);
      console.log("Oooops!"+error);
    }
  });
}
presentAlert(subTitleMessage) {
  let alert = this.alertCtrl.create({
  subTitle: subTitleMessage,
  buttons: ['OK']
});
alert.present();
}
}
  /*var t1=new Date();
    var t2 = new Date(t1.setMinutes(t1.getMinutes()+330)).toISOString();
console.log(t2);
var myObj = {
    gps_cordinates:"latitude:"+"12.9429486iii"+",longitude:77.6188559888",
        up_date:t2,
}
this.logs.push(myObj);
this.logs.push(myObj);
localStorage.setItem("save", JSON.stringify(this.logs));*/
//console.log('before');
 /* logs: any=[];
  options: RequestOptions;

  constructor(private alertCtrl: AlertController,public http: Http,public locationTracker:LocationTrackerProvider,public navCtrl: NavController, public navParams: NavParams) {
   // this.logs=JSON.parse(localStorage.getItem("dashLog"));
   //setInterval(this.abc,20000);
   this.abc();

  }
  abc=()=>{
    var t2 = new Date().toISOString().slice(0,16);
    console.log(t2);
    var myObj = {
      gps_cordinates: '"latitude:"+12.9429486+",longitude:"+77.6188559',
      up_date: t2 ,
      user_id:1,
  }
  this.logs.push(myObj);
  this.logs.push(myObj);
  this.logs.push(myObj);
  console.log(this.logs);
  localStorage.setItem("save", JSON.stringify(this.logs));
  var len=[];
  len=JSON.parse(localStorage.getItem("save"));
  console.log(len);
 // localStorage.removeItem("save");
 /* if(len==null){
    this.logs.push(myObj);
    localStorage.setItem("save", JSON.stringify(this.logs));
  }
  else{
    len.push(myObj);
  localStorage.setItem("save", JSON.stringify(len));
  }
  //this.post();
  }
  postGPS(lat,lng,time,index,leng){
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
       var link = '/rt/api/v1.0/gps_logs';
       var local =JSON.parse(localStorage.getItem('userData'));
       var gps_cordinates = "latitude:"+lat+",longitude:"+lng;
 this.http.post(link, {gps_coordinates: gps_cordinates,user_id:local.user_id,up_date:time},this.options)
       .map(res => res.json())
       .subscribe(data => {
       /* if(index==leng-1){
          localStorage.removeItem("save");
           this.logs=[];
         }
           console.log(data);
       },
        error=>{
          this.presentAlert(JSON.parse(error).message+" Gps");
            console.log(error);

        });
}
post(){
var a=[];
a = JSON.parse(localStorage.getItem("save"));
console.log(a);
for(var i=0;i<a.length;i++){
  this.postGPS(a[i].lat,a[i].lng,a[i].time,i,a.length);
}}

presentAlert(message){
  let alert = this.alertCtrl.create({
  subTitle: message,
  buttons: ['OK']
});
alert.present();
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad GpsLogPage');
  }

}*/
