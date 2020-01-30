import { Component ,ViewChild,} from '@angular/core';
import { Platform,IonicPage, NavController, NavParams ,LoadingController,AlertController} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Content } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
import { MatSnackBar } from '@angular/material';
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  displayedColumns = ['take','unit_sr_no','issue_number', 'q_name','title', 'created_on', 'status_desc','assignee_name','requestor','tkt_type','up_date','priority'];
 @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(Content) content: Content;
  //css used to toggle button color before and after clicked
  a_assigned:boolean=false;
  q_group:boolean=false;
  h_role:boolean=false;
  q_unassign:boolean=false;
  u_group:boolean=false;
  loading:any;
  assigned_tkts_overdue:any;
  assigned_tkts_overduehide=false;
  q_group_tkts_overdue:any;
  q_group_tkts_overduehide=false;
  have_role:any;
  have_rolehide=false;
  q_unassigned:any;
  q_unassignedhide=false;
  user_group_tkts_overdue:any;
  user_group_tkts_overduehide=false;
  current_status:boolean=false;
  dataSource:any=[];
  issueList:any;
  items:any[]=[];
  options: RequestOptions;
  //loading:any;
  abc:any=[];
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
  itemsApp:any[]=[];
  priorityDec:boolean=false;
  assignDec:boolean=false;
  sirtIssue:boolean=true;
  sortq:boolean=true;
  sortAssign:boolean=true;
  sorttype:boolean=true;
  sortPriorty:boolean=true;
  itemstemp:any;
  isExt:boolean=false;
  serialLength:any;
  selectedSearch=0;
  typeLen:any;
  priorityLen:any;
  ngAfterViewInit() {
    this.refreshData(this.dataSource);
    
  }

  constructor(public snackBar:MatSnackBar,public locationTracker:LocationTrackerProvider,public navCtrl: NavController, public navParams: NavParams,public loadingController:LoadingController,public http: Http,private alertCtrl: AlertController,public platform:Platform) {
    if(this.platform.is('core')){
      this.isBrowser = false;
    }
    this.local =JSON.parse(localStorage.getItem('userData'));
  }

 async ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    var userDat=JSON.parse(localStorage.getItem('userData'));
    this.isExt=userDat.is_external;
    console.log(userDat);
    var link;
    if(userDat.is_external==true){
        link='/rt/api/v1.0/users/'+userDat.id+'/dashboard';
        this.issueListForExternal(link);   
    }
    else{
      this.myOverduecount(); 
      this.queueOverduecount();
      this.currentStatuscount();
      this.groupOverduecount();
      this.unassignedCount();
}
  }
  searchBy(opt){
    console.log(opt);
    this.selectedSearch=opt;
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
  myOverduecount(){
   // var loading_over = this.loadingController.create({ content: `Page Loading...`, });
    //loading_over.present();
   var link = '/rt/api/v1.0/dashboard/my_rt_overdue_tickets';
   //link = '/rt/api/v1.0/public_queues';
  console.log(link);
      this.http.get(link)
  .map(res => res.json())
  .subscribe(data => {
    //loading_over.dismiss();
    console.log(data);
        this.assigned_tkts_overdue=data.assigned_tkts_overdue;
        this.assigned_tkts_overduehide=true;
  },  error => {
    this.assigned_tkts_overduehide=true;
    //loading_over.dismiss();
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
  queueOverduecount(){
    //var loading_count = this.loadingController.create({ content: `Page Loading...`, });
    //loading_count.present();
   var link = '/rt/api/v1.0/dashboard/rt_tickets_overdue_for_q_owner_q_group_head';
  console.log(link);
      this.http.get(link)
  .map(res => res.json())
  .subscribe(data => {
    //loading_count.dismiss();
    console.log(data);
    this.q_group_tkts_overduehide=true;
    this.q_group_tkts_overdue=data.tickets_overdue_for_q_owner_q_group_head;
   
  },  error => {
    this.q_group_tkts_overduehide=true;
    //loading_count.dismiss();
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
  currentStatuscount(){
    //var loading_current = this.loadingController.create({ content: `Page Loading...`, });
    //loading_current.present();
   var link = '/rt/api/v1.0/dashboard/rt_ticket_where_I_have_roles';
  console.log(link);
      this.http.get(link)
  .map(res => res.json())
  .subscribe(data => {
    //loading_current.dismiss();
    console.log(data);
    this.have_rolehide=true;
    this.have_role=data.tickets_with_curr_status_where_i_have_roles;
    
  },  error => {
    this.have_rolehide=true;
    //loading_current.dismiss();
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
  groupOverduecount(){
    //var loading_group = this.loadingController.create({ content: `Page Loading...`, });
    //loading_group.present();
   var link = '/rt/api/v1.0/dashboard/rt_tickets_overdue_for_my_groups';
  console.log(link);
      this.http.get(link)
  .map(res => res.json())
  .subscribe(data => {
    //loading_group.dismiss();
    console.log(data); 
    this.user_group_tkts_overduehide=true;
    this.user_group_tkts_overdue=data.tickets_overdue_for_my_groups;
  },  error => {
    this.user_group_tkts_overduehide=true;
    //loading_group.dismiss();
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
  issueListForExternal(link){
    this.current_status=true;
    this.http.get(link)
      .subscribe(data => {
        console.log(data['_body']);
       }, error => {
        if(JSON.parse(error).msg!=undefined){
          if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
            this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
      this.servercall(link);

  }
  unassignedCount(){
    //var loading_unassigned = this.loadingController.create({ content: `Page Loading...`, });
    //loading_unassigned.present();
   var link = '/rt/api/v1.0/dashboard/rt_tickets_unassigned';
   //link = '/rt/api/v1.0/public_queues';
  console.log(link);
      this.http.get(link)
  .map(res => res.json())
  .subscribe(data => {
    //loading_unassigned.dismiss();
    console.log(data);
        this.q_unassigned=data.tickets_unassigned;
        this.q_unassignedhide=true;
        console.log(this.q_unassigned);
  },  error => {
    //loading_unassigned.dismiss();
      this.q_unassignedhide=true;
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
          
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
  unassignedTicket(elementId,appId){
    this.a_assigned=false;
    this.q_group=false;
    this.h_role=false;
    this.q_unassign=true;
    this.u_group=false;
    this.current_status=true;
    let link='/rt/api/v1.0/dashboard/rt_tickets_unassigned';
    this.http.get(link)
      .subscribe(data => {
        if(!this.isBrowser){
          let y = document.getElementById(elementId).offsetTop;
          this.content.scrollTo(0, y);
        }
        else{
          let y = document.getElementById(appId).offsetTop;
          this.content.scrollTo(0, y);
        }
        console.log(data['_body']);
       }, error => {
        if(JSON.parse(error).msg!=undefined){
          if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
            this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
      this.servercall(link);
      
  }
  myOverdue(elementId,appId){
    this.current_status=true;
    this.a_assigned=true;
    this.q_group=false;
    this.h_role=false;
    this.q_unassign=false;
    this.u_group=false;
    let link='/rt/api/v1.0/dashboard/my_rt_overdue_tickets';
    this.http.get(link)
      .subscribe(data => {
        console.log(data['_body']);
        if(!this.isBrowser){
          let y = document.getElementById(elementId).offsetTop;
          this.content.scrollTo(0, y);
        }
        else{
          let y = document.getElementById(appId).offsetTop;
          this.content.scrollTo(0, y);
        }
       }, error => {
        if(JSON.parse(error).msg!=undefined){
          if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
            this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
      this.servercall(link);
      
  }
  queueOverdue(elementId,appId){
    this.current_status=true;
    this.a_assigned=false;
    this.q_group=true;
    this.h_role=false;
    this.q_unassign=false;
    this.u_group=false;
    let link="/rt/api/v1.0/dashboard/rt_tickets_overdue_for_q_owner_q_group_head";
    this.http.get(link)
    .subscribe(data => {
      if(!this.isBrowser){
        let y = document.getElementById(elementId).offsetTop;
        this.content.scrollTo(0, y);
      }
      else{
        let y = document.getElementById(appId).offsetTop;
        this.content.scrollTo(0, y);
      }
      console.log(data['_body']);
     }, error => {
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired"  || JSON.parse(error).msg=="The access token has expired"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
    this.servercall(link);
  }
  currentStatus(elementId,appId){
    this.current_status=true;
    this.a_assigned=false;
    this.q_group=false;
    this.h_role=true;
    this.q_unassign=false;
    this.u_group=false;
    let link='/rt/api/v1.0/dashboard/rt_ticket_where_I_have_roles';
    this.http.get(link)
    .subscribe(data => {
      if(!this.isBrowser){
        let y = document.getElementById(elementId).offsetTop;
        this.content.scrollTo(0, y);
      }
      else{
        let y = document.getElementById(appId).offsetTop;
        this.content.scrollTo(0, y);
      }
      console.log(data['_body']);
     }, error => {
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired"  || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
    this.servercall(link);
  }
  groupOverdue(elementId,appId){
    this.current_status=true;
    this.a_assigned=false;
    this.q_group=false;
    this.h_role=false;
    this.q_unassign=false;
    this.u_group=true;
    let link="/rt/api/v1.0/dashboard/rt_tickets_overdue_for_my_groups";
    this.http.get(link)
    .subscribe(data => {
      console.log(data['_body']);
      if(!this.isBrowser){
        let y = document.getElementById(elementId).offsetTop;
        this.content.scrollTo(0, y);
      }
      else{
        let y = document.getElementById(appId).offsetTop;
        this.content.scrollTo(0, y);
      }
     }, error => {
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired"  || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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
    this.servercall(link);
  }
  servercall(link:string){
    var loading_server = this.loadingController.create({ content: `Page Loading...`, });
    loading_server.present();
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.options = new RequestOptions({ headers: headers });
    console.log(link);
        this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
        this.issueList = data.issue_list;
        this.tempIssueList = data.issue_list;
        this.SerialTypePriority(this.tempIssueList);
        this.sortId(true);
        this.initializeItems();
        this.refreshData(this.tempIssueList);
        loading_server.dismiss();
    },  error => {
      loading_server.dismiss();
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired"  || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.openSnackBar(JSON.parse(error).msg+" Redirecting to login page");
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

  refreshData(data:any[]){
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }
  SerialTypePriority(data){ //getting number of issues  which contain unit serial number
    this.serialLength=data.filter(x=>x.xdata2.unit_sr_no!=null).length;
    this.typeLen=data.filter(x=>x.xdata2.type_id!=null).length;
    this.priorityLen=data.filter(x=>x.xdata2.priority!=null).length;
    console.log(this.serialLength);
  }
  initializeItems(){
        this.items = this.issueList;
        this.itemsApp=this.issueList;
  }
  viewDetail(event,detail){
    event.stopPropagation();
    sessionStorage.setItem('clickedIssue',JSON.stringify(detail));
    this.navCtrl.push('UpdateRequestPage',{id: detail}); 
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
    var loading_take = this.loadingController.create({ content: `Page Loading...`, });
    loading_take.present();
    var link = '/rt/api/v1.0/issues/'+item.id+'/take';
        this.http.put(link,'',this.options)
    .subscribe(data => {
      loading_take.dismiss();
        console.log("Oooops!"+data);
        this.servercall(link);
    },  error => {
        loading_take.dismiss();
        if(JSON.parse(error).msg!=undefined){
          if(JSON.parse(error).msg=="Token has expired"  || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
            this.openSnackBar('Unable to determine file type without an extension');(JSON.parse(error).msg+" Redirecting to login page");
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
  lastupdateToLocal(up_date){
    var toLocal=(new Date(up_date));
    toLocal=new Date(toLocal.setMinutes(toLocal.getMinutes()+660))
    var req=toLocal.toISOString().substr(0,10)+" "+toLocal.toISOString().slice(11,16);
       
    return req
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
    subTitle: subTitleMessage,
    buttons: ['OK']
  });
    alert.present();
  }
  openSnackBar(message:string){
    this.snackBar.open(message,"",{
      duration:5000,
      panelClass:['snackbar']
    })
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

sortAssignee(){
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
 }*/
}