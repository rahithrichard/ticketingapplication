import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController,AlertController, Platform} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { DatePicker } from 'angular2-datetimepicker';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
@IonicPage()
@Component({
  selector: 'page-pendency-report',
  templateUrl: 'pendency-report.html',
})
export class PendencyReportPage implements OnInit{
 /* date: Date = new Date();
  value=null;
	settings = {
		bigBanner: true,
		timePicker: true,
		format: 'dd-MM-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect:true,
    rangepicker: true,
    
  }*/
  displayedColumns = [ 'queue','issue_number','issue_title',];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any=[];
  isBrowser:boolean=false;
  loading:any;
  authForm: FormGroup;
  reqDate = new Date();
  todayDtTm:any;
  closeData:any;
  userList:any;
  ngAfterViewInit() {
    this.refreshData(this.dataSource);
    
  }
  constructor(public locationTracker:LocationTrackerProvider,public platform: Platform,public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder,public loadingController:LoadingController,public http: Http,private alertCtrl: AlertController) {
    if(this.platform.is('core') || this.platform.is('mobileweb')){
      this.isBrowser = true;
    }
    var req=new Date(this.reqDate.getTime() - (this.reqDate.getTimezoneOffset() * 60000)).toISOString().substr(0,16);
    this.authForm = formBuilder.group({
    //	from_datetime: [new Date(),[Validators.required]],
   from_datetime:[req,[Validators.required]],
  		end_date: [req],
      //user:['']
    });
    /*
        ngOnInit() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.defaultOpen) {
            this.popover = true;
        }
    DatePicker.prototype.setDay=function(evt){
      if(evt.target.innerHTML){
        var selectedDay=parseInt(evt.target.innerHTML);
        this.date=new Date(this.date.setDate(selectedDay));
        console.log(this.date);
        this.onChangeCallback(this.date.toString());
        if(this.settings.closeOnSelect){
          this.popover=false;
          this.onDateSelect.emit(this.date);
        }
      }
    }*/
  }
  refreshData(data:any[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
}
  ngOnInit(){
       var a=new Date();
       console.log(a.getTime());
  }
 
  ionViewDidLoad(){
    this.loading = this.loadingController.create({ content: `Page Loading...`, });
    this.loading.present();
    var link = '/admin/api/v1.0/users';
    console.log(link);
        this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
        this.userList = data.users;
        console.log(data);
        this.loading.dismiss();
    },  error => {
        this.loading.dismiss();
        if(JSON.parse(error).msg!=undefined){
          if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
            this.presentAlert(JSON.parse(error).msg+" Redirecting to login page");
            this.locationTracker.goToLogin();
          } 
          else{
            this.presentAlert(JSON.parse(error).msg);
          }
          console.log(error);
        } 
        else{
          this.presentAlert(JSON.parse(error).message);
          console.log("Oooops!"+error);
        }
    });
  }
  presentAlert(message){
	  	let alert = this.alertCtrl.create({
	    subTitle: message,
	    buttons: ['OK']
	  });
	  alert.present();
  }
  stageDetail(event,row){
    console.log(event,row.issue_number);
    sessionStorage.setItem('clickedIssueNumber',JSON.stringify(row.issue_number));
    this.navCtrl.push('PendencyStagePage'); 
  }
  onSubmit(value: any): void {
    console.log(value);
    console.log(value.from_datetime.substr(0,16));
  	 let formData=new FormData();
  	 formData.append('from_datetime',value.from_datetime.substr(0,16)); 	
      formData.append('to_datetime',value.end_date.substr(0,16));
    /* else{
       this.todayDtTm=new Date(this.reqDate.getTime() - (this.reqDate.getTimezoneOffset() * 60000)).toISOString().substr(0,16);
       formData.append('end_date',this.todayDtTm);
     } */	 
    this.loading = this.loadingController.create({ content: `Page Loading...`, });
    this.loading.present();
    var link = '/rt/api/v1.0/reports/issue_pendency_report';
    this.http.post(link,formData)
    .map(res => res.json())
    .subscribe(data => {
        console.log(data);
        sessionStorage.setItem('pandencyDetail',JSON.stringify(data));
        console.log(data['q_user_wise_pendency_list']);
        var userPandency=data['q_user_wise_pendency_list'];
        if(!data['q_user_wise_pendency_list']){
          this.closeData=[];
          this.presentAlert("No values matching the criteria");
        }
        else{
          var pendency=[];
          for (let entry of userPandency){
            var a={};
            a=entry[Object.keys(entry)[0]][0];
            a["pendency_count"]=entry[Object.keys(entry)[1]];
            pendency.push(a);
          }
          console.log(pendency);
          this.closeData=pendency;
        }
        this.refreshData(this.closeData);
        this.loading.dismissAll();
    },  error => {
        this.loading.dismiss();
        if(JSON.parse(error).msg!=undefined){
          if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
            this.presentAlert(JSON.parse(error).msg+" Redirecting to login page");
            this.locationTracker.goToLogin();
          } 
          else{
            this.presentAlert(JSON.parse(error).msg);
          }
          console.log(error);
        }
        else{
          this.presentAlert(JSON.parse(error).message);
          console.log("Oooops!"+error);
        }
    });
  }
}
