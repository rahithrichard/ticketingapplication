import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController,AlertController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {MatExpansionModule} from '@angular/material/expansion';
import { getQueryValue } from '@angular/core/src/view/query';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  loading:any;
  authForm: FormGroup;
  reqDate = new Date(); 
   todayDtTm:any;
  closeData:any;
  createdData:any;
  openData:any;
  workedData:any;
  number_of_closed_issues:any;
  number_of_created_issues:any;
  number_of_issues_worked:any;
  number_of_open_issues:any;
  constructor(public locationTracker:LocationTrackerProvider,public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder,public loadingController:LoadingController,public http: Http,private alertCtrl: AlertController) {
    var req=new Date(this.reqDate.getTime() - (this.reqDate.getTimezoneOffset() * 60000)).toISOString().substr(0,16);
  
    this.authForm = formBuilder.group({
  		from_datetime: [req,[Validators.required]],
  		end_date: [req],
  		check_open:[true],
  		check_created:[true],
  		check_worked:[true],
  		check_closed:[true],
  	});
  }
  ionViewDidLoad(){}
  presentAlert(subTitleMessage){
    let alert = this.alertCtrl.create({
      subTitle:subTitleMessage,
      buttons: ['OK']
    });
    alert.present();
  }
  lastupdateToLocal(up_date){
    //toLocal=(new Date(up_date)).toLocaleString("en-US", {timeZone: "America/New_York"});
    var toLocal=(new Date(up_date));
    toLocal=new Date(toLocal.setMinutes(toLocal.getMinutes()+330))
    var req=toLocal.toISOString().substr(0,10)+" "+toLocal.toISOString().slice(11,16);
       
    return req;
 }
  onSubmit(value: any): void {
    console.log(value);
    var o=new Date().getTimezoneOffset();
    console.log(o);
    var a=new Date(value.from_datetime.substr(0,16)).toString().substr(0,33);
    //var a1=new Date(a.setMinutes(a.getMinutes()+o)).toString().substr(0,33);
    var b=new Date(value.end_date.substr(0,16)).toString().substr(0,33);
    //var b1=new Date(b.setMinutes(b.getMinutes()+o)).toString().substr(0,33);
    console.log(a,b);
  	 let formData=new FormData();
     formData.append('from_datetime',a);
	   formData.append('check_open',value.check_open);
	   formData.append('check_created',value.check_created);
	   formData.append('check_worked',value.check_worked);
	   formData.append('check_closed',value.check_closed);	 	
      formData.append('to_datetime',b);
   
    this.loading = this.loadingController.create({ content: `Page Loading...`, });
    this.loading.present();
    var link = '/rt/api/v1.0/reports/issue_status_report';
    this.http.post(link,formData)
    .map(res => res.json())
    .subscribe(data => {
        console.log(data);
        if(data.message=='No values matching the criteria'){
            this.presentAlert(data.message);
        }
        this.number_of_closed_issues=data.number_of_closed_issues;
        this.number_of_open_issues=data.number_of_open_issues;
        this.number_of_issues_worked=data.number_of_issues_worked;
        this.number_of_created_issues=data.number_of_created_issues;
        
        this.closeData = data.q_wise_closed_list;
        this.createdData = data.q_wise_created_issue_list;
        this.openData = data.q_wise_open_issue_list;
        this.workedData = data.q_wise_worked_list;
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