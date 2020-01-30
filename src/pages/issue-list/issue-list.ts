import { Component,ViewChild } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams ,LoadingController,AlertController} from 'ionic-angular';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import { UpdateRequestPage } from '../update-request/update-request';
import 'rxjs/add/operator/map';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {Sort,MatIconRegistry} from '@angular/material';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
@IonicPage()
@Component({
  selector: 'page-issue-list',
  templateUrl: 'issue-list.html',
})
export class IssueListPage {
  displayedColumns = ['take','unit_sr_no','issue_number', 'q_name','title', 'created_on', 'status_desc','assignee_name','requestor','tkt_type','up_date','priority'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource:any=[];
  issueList:any;
  items:any[]=[];
  itemsApp:any[]=[];
  options: RequestOptions;
  loading:any;
  tempIssueList:any;
  isBrowser:boolean=true;
  sortList:boolean=true;
  local:any;
  sortStatus:boolean = true;
  visible:boolean = false;
  statusDec:boolean = false;
  sortIssueDec:boolean=false;
  qDec:boolean=false;
  typeDec:boolean=false;
  priorityDec:boolean=false;
  assignDec:boolean=false;
  sortSerial:boolean=false;
  sortSerialDec:boolean=false;
  sirtIssue:boolean=true;
  sortq:boolean=true;
  sortAssign:boolean=true;
  sorttype:boolean=true;
  sortPriorty:boolean=true;
  itemstemp:any;
  selectedSearch=0;
  serialLength:any;
  typeLen:any;
  priorityLen:any;
  ngAfterViewInit() {
    this.refreshData(this.dataSource);
    
  }
  constructor(public locationTracker:LocationTrackerProvider,public nav: NavController, public navParams: NavParams,public http: Http,public loadingController:LoadingController,public platform:Platform,private alertCtrl: AlertController){
    if(this.platform.is('core')){
      this.isBrowser = false;
    }
    this.local =JSON.parse(localStorage.getItem('userData'));
  }
  ionViewDidLoad(){
    this.loading = this.loadingController.create({ content: `Page Loading...`, });
    this.loading.present();
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.options = new RequestOptions({ headers: headers });
    var link = '/rt/api/v1.0/issues';
    console.log(link);
        this.http.post(link,'status:2',this.options)
    .map(res => res.json())
    .subscribe(data => {
        this.issueList = data.issue_list;
        this.tempIssueList = data.issue_list;
        console.log(this.tempIssueList);
        this.SerialTypePriority(this.tempIssueList);
        this.sortId(true);
        this.initializeItems();
        this.refreshData(this.tempIssueList);
        this.loading.dismiss();
    },  error => {
        this.loading.dismiss();
        if(JSON.parse(error).msg!=undefined){
          if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed" ){
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
  SerialTypePriority(data){ //getting number of issues  which contain unit serial number
  this.serialLength=data.filter(x=>x.xdata2.unit_sr_no!=null).length;
  this.typeLen=data.filter(x=>x.xdata2.type_id!=null).length;
  this.priorityLen=data.filter(x=>x.xdata2.priority!=null).length;
  console.log(this.serialLength);
}
  refreshData(data:any[]){
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }
  lastupdateToLocal(up_date){
    //toLocal=(new Date(up_date)).toLocaleString("en-US", {timeZone: "America/New_York"});
    var toLocal=(new Date(up_date));
    toLocal=new Date(toLocal.setMinutes(toLocal.getMinutes()+660));
    var req=toLocal.toISOString().substr(0,10)+" "+toLocal.toISOString().slice(11,16);
       
    return req;
 }
  initializeItems(){
        this.items = this.issueList;
        //console.log(this.items);
        this.itemsApp=this.issueList;
  }
  viewDetail(event,detail){
    console.log(detail);
    event.stopPropagation();
    sessionStorage.setItem('clickedIssue',JSON.stringify(detail));
    this.nav.push('UpdateRequestPage',{id: detail}); 
  }
  getItems(ev: any,a) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the searchbar
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
          if(a=='1'){
          this.itemstemp = this.items.filter((item) => {
          return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
        }
        else if(a=='2'){
          this.itemstemp = this.items.filter((item) => {
            return (item.issue_number.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
        }
        else if(a=='4'){
          this.itemstemp = this.items.filter((item) => {
            if(item.requestor!=null)
              return (item.requestor.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
        }
        else{
          this.itemstemp = this.items.filter((item) => {
            if(item.xdata2.unit_sr_no!=null)
            return (item.xdata2.unit_sr_no.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
        }
        this.refreshData(this.itemstemp);
        this.itemsApp=this.itemstemp;
      }else{
      this.refreshData(this.items);
      this.itemsApp=this.items;
    }
  }
  searchBy(opt){
    console.log(opt);
    this.selectedSearch=opt;
  }
  sortId(descending:boolean):any[]{
    this.tempIssueList.sort(function(a,b){
      if(descending==true)
        return new Date(b.id).getTime()-new Date(a.id).getTime();
      if(descending==false)
        return new Date(a.id).getTime()-new Date(b.id).getTime();
    });
    console.log(this.tempIssueList);
    return this.tempIssueList;
  }
  getcolor(priority) { 
    switch(priority){
      case 'H':
       return '#fc3535';
       case 'M':
       return '#745cfc';
       case 'L':
       return '#d3aa23';
    }
  }
  takeIssue(event, item){
    console.log(item);
    event.stopPropagation();
    let headers: any = new Headers();
    headers.append('Content-Type', 'Application/json');
    this.options = new RequestOptions({ headers: headers });
    this.loading = this.loadingController.create({ content: `Page Loading...`, });
    this.loading.present();
    var link = '/rt/api/v1.0/issues/'+item.id+'/take';
        this.http.put(link,this.options)
    .subscribe(data => {
        this.loading.dismiss();
        this.presentAlert("Assigned successfully");
        console.log("Oooops!"+data);
        this.ionViewDidLoad();
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

  takeColor(take){
   if(take.allow_to_take){
    if(take.assigned_to == this.local.user_id)
    {
      return  'rgb(248, 197, 150)';
    }
    else if(take.role_desc1 == 'can_edit_tkt' || take.role_desc1 == 'can_take' || take.role_desc1 == 'can_assign_tkt'){
        return 'rgb(226, 113, 6)';
    }
    else  
        return 'rgb(250, 168, 250)'; 
   }
   else{
       return 'grey';
   }
  }

  takeDisabled(take){
    if(take.allow_to_take){
      if(take.assigned_to == this.local.user_id)
      {
        return true;
      }
      else if(take.role_desc1 == 'can_edit_tkt' || take.role_desc1 == 'can_take' || take.role_desc1 == 'can_assign_tkt'){
          return false;
      }
      else  
          return true; 
     }
     else{
         return true;
     }
  }

  presentAlert(subTitleMessage){
    let alert = this.alertCtrl.create({
      subTitle:subTitleMessage,
      buttons: ['OK']
    });
    alert.present();
  }
  /*sortfunction(){
    this.sortList = !this.sortList;
    this.sortCreateDate(this.sortList);
    if(this.sortList)
      this.visible = false;
    else
      this.visible = true;
  }
  sortCreateDate(descending:boolean):any[]{
    this.tempIssueList.sort(function(a,b){
      if(descending==true)
      return new Date(b.created_on).getTime()-new Date(a.created_on).getTime();
      if(descending==false)
      return new Date(a.created_on).getTime()-new Date(b.created_on).getTime();
    });
    console.log(this.tempIssueList);
    return this.tempIssueList;
  }
sortfunctionStatus(){
    this.sortStatus = !this.sortStatus;
    this.sortStatusfn(this.sortStatus);
    if(this.sortStatus)
      this.statusDec = false;
    else
      this.statusDec = true;
  }

  sortStatusfn(descending:boolean):any[]{
    this.tempIssueList.sort(function(a,b){
      if(descending==true)
      return b.status-a.status;
      if(descending==false)
      return a.status-b.status;
    });
     console.log(this.tempIssueList);
     return this.tempIssueList;
  }

  sortfunctionIssueNum(){
    this.sirtIssue = !this.sirtIssue;
    this.sortId(this.sirtIssue);
    if(this.sirtIssue)
      this.sortIssueDec = false;
    else
      this.sortIssueDec = true;
  }
 sortSerialNum(){
    this.sortSerial = !this.sortSerial;
    this.sortSerialFun(this.sortSerial);
    if(this.sortSerial)
      this.sortSerialDec = false;
    else
      this.sortSerialDec = true;
  }
  sortSerialFun(descending:boolean){
    this.tempIssueList.sort(function(a,b){
      if(descending==true)
      return b.unit_sr_no-a.unit_sr_no;
      if(descending==false)
      return a.unit_sr_no-b.unit_sr_no;
    });
     console.log(this.tempIssueList);
     return this.tempIssueList;
  }
 sortQ(){
    this.sortq = !this.sortq;
    this.sortQfn(this.sortq);
    if(this.sortq)
      this.qDec = false;
    else
      this.qDec = true;
 }
 sortQfn(descending:boolean){
      this.tempIssueList.sort(function(a,b){
      if(descending==true)
      return b.q_id-a.q_id;
      if(descending==false)
      return a.q_id-b.q_id;
    });
     console.log(this.tempIssueList);
     return this.tempIssueList;
 }

/*sortAssignee(){
    this.sortAssign = !this.sortAssign;
    this.sortAssigneefn(this.sortAssign);
    if(this.sortAssign)
      this.assignDec = false;
    else
      this.assignDec = true;
 }
 sortAssigneefn(descending:boolean){
      this.tempIssueList.sort(function(a,b){
      if(descending==true)
      return b.assigned_to-a.assigned_to;
      if(descending==false)
      return a.assigned_to-b.assigned_to;
    });
     console.log(this.tempIssueList);
     return this.tempIssueList;
 }
 sortType(){
    this.sorttype = !this.sorttype;
    this.sortTypefn(this.sorttype);
    if(this.sorttype)
      this.typeDec = false;
    else
      this.typeDec = true;
 }
 sortTypefn(descending:boolean){
      this.tempIssueList.sort(function(a,b){
      if(descending==true)
      return b.type_id-a.type_id;
      if(descending==false)
      return a.type_id-b.type_id;
    });
     console.log(this.tempIssueList);
     return this.tempIssueList;
 }
 sortPriority(){
    this.sortPriorty = !this.sortPriorty;
    this.sortPriorityfn(this.sortPriorty);
    if(this.sortPriorty)
      this.priorityDec = false;
    else
      this.priorityDec = true;
 }
 sortPriorityfn(descending:boolean){
      this.tempIssueList.sort(function(a,b){
      if(descending==true)
      return b.priority-a.priority;
      if(descending==false)
      return a.priority-b.priority;
    });
     console.log(this.tempIssueList);
     return this.tempIssueList;
 }
*/
}
