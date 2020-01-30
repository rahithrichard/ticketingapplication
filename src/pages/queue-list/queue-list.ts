import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
/**
 * Generated class for the QueueListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-queue-list',
  templateUrl: 'queue-list.html',
})
export class QueueListPage {

  queueList:any;
  items:any[]=[];
  options: RequestOptions;
  constructor(public locationTracker:LocationTrackerProvider,private alertCtrl: AlertController,public nav: NavController, public navParams: NavParams,public http: Http){}
  ionViewDidLoad(){
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.options = new RequestOptions({ headers: headers });
    var link = '/rt/api/v1.0/queues';
        this.http.get(link,this.options)
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
        this.queueList = data.queue_list;
        this.initializeItems();
    },  error => {
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
  
  initializeItems(){
        this.items = this.queueList;
  }
  viewDetail(detail){
//        console.log("detail!"+JSON.stringify(detail));
  sessionStorage.setItem('clickedIssue',JSON.stringify(detail));
  this.nav.push('UpdateRequestPage',{id: detail}); 
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the searchbar
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
          this.items = this.items.filter((item) => {
          return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
  }
  presentAlert(subTitleMessage){
    let alert = this.alertCtrl.create({
      subTitle:subTitleMessage,
      buttons: ['OK']
    });
    alert.present();
  }
}
