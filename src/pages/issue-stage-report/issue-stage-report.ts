import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage,NavController,NavParams,LoadingController,AlertController, Platform} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { DatePicker } from 'angular2-datetimepicker';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
@IonicPage()
@Component({
  selector: 'page-issue-stage-report',
  templateUrl: 'issue-stage-report.html',
})
export class IssueStageReportPage {
  authForm: FormGroup;
  displayedColumns = ['users'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any=[];
  reqDate = new Date();
  loading:any;
  issueList:any;
  constructor(public locationTracker:LocationTrackerProvider,public platform: Platform,public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder,public loadingController:LoadingController,public http: Http,private alertCtrl: AlertController) {
    var req=new Date(this.reqDate.getTime() - (this.reqDate.getTimezoneOffset() * 60000)).toISOString().substr(0,16);
    this.authForm = formBuilder.group({
   from_datetime:[req,[Validators.required]],
  		end_date: [req],
      //user:['']
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad IssueStageReportPage');
  }
  refreshData(data:any[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
}
  onSubmit(value: any): void {
    console.log(value);
    console.log(value.from_datetime.substr(0,16));
  	 let formData=new FormData();
  	 formData.append('from_datetime',value.from_datetime.substr(0,16)); 	
       formData.append('to_datetime',value.end_date.substr(0,16));
    this.loading = this.loadingController.create({ content: `Page Loading...`, });
    this.loading.present();
    var link = '/rt/api/v1.0/reports/user_issue_report';
    this.http.post(link,formData)
    .map(res => res.json())
    .subscribe(data => {
      var a=[];
      if(data['user_wise_stage_list']){
        a=data['user_wise_stage_list'];
        this.refreshData(a);
        console.log(a);
        var d=[];
        for (let entry of a){
          var b=[];
          var c;
          c=entry[Object.keys(entry)[0]];
          for(let i of c[0]){
              var issueObj={
              issueNum:Object.keys(i)[0],
              stageLength:i[Object.keys(i)[0]].length,
              isuList:i[Object.keys(i)[0]],
            }
            if(issueObj.stageLength!=0)
              b.push(issueObj);   
          }
          d.push(b);
        }
        this.issueList=d;
        console.log(d);
      }
      else{
        this.refreshData(a);
        this.presentAlert(" No Data Found ");
      }
      this.loading.dismissAll();
      this.loading.dismissAll();
      }, error => {
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
  userName(elem){
    return Object.keys(elem);
  }
  presentAlert(message){
    let alert = this.alertCtrl.create({
    subTitle: message,
    buttons: ['OK']
  });
  alert.present();
}
}
