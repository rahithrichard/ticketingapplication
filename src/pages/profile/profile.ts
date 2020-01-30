import { Component,ViewChild } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams ,LoadingController,AlertController} from 'ionic-angular';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  displayedColumns = ['q_name','status_desc','role_desc'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading:any;
  dataSource:any=[];
  queueList:any;
  testList:any;
  testListKeys:any;
  constructor(public locationTracker:LocationTrackerProvider,public nav: NavController, public navParams:NavParams,public http: Http,public loadingController:LoadingController,public platform:Platform,private alertCtrl: AlertController){
  }
  ngAfterViewInit() {
    this.refreshData(this.dataSource);
    
  }
  refreshData(data:any[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
}
  ionViewDidLoad(){
    this.loading = this.loadingController.create({ content: `Page Loading...`, });
    this.loading.present();
    var link = '/rt/api/v1.0/my_profile';
    console.log(link);
        this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
    	console.log(data.my_q_status_role_list);
    	this.queueList = data.my_q_status_role_list;
        this.loading.dismiss();
        //this.testList = _.groupBy(this.queueList,'mqueue_id');
        this.testList={};
        data.my_q_status_role_list.map(function(val,index){
        	if(!this.testList.hasOwnProperty(val['q_name'])){
        		this.testList[val["q_name"]]=[val];
        	}
        	else
        		this.testList[val["q_name"]].push(val);
        	if(index==data.my_q_status_role_list.length-1){
        		console.log(this.testList);
        		this.testListKeys=Object.keys(this.testList);
        	}
        },this);
        this.refreshData(this.testListKeys);
       // console.log(_.groupBy(this.queueList,'mqueue_id'))
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
  getItems(ev: any) {
    // Reset items back to all of the items
    // set val to the value of the searchbar
    const val = ev.target.value;
    var testKey;
    if (val && val.trim() != '') {
        testKey= this.testListKeys.filter((item) => {
      return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.refreshData(testKey);
    }
    else
      this.refreshData(this.testListKeys);
  }
  presentAlert(subtitleMessage){
	 let alert = this.alertCtrl.create({
	 subTitle: subtitleMessage,
	 buttons: ['OK']
	 });
	alert.present();
  }
}