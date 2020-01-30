import { Component,ViewChild } from '@angular/core';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Platform, IonicPage, NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import {map} from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {  FileTransfer,  FileTransferObject  } from '@ionic-native/file-transfer';  
import {  File } from '@ionic-native/file'; 
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
@IonicPage()
@Component({
  selector: 'page-update-request',
  templateUrl: 'update-request.html',
})
export class UpdateRequestPage {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['up_date','updated_by','column_name','remarks','predefined_update','internal_only'];
  id: any;
  //req:boolean=false;
  //cont:boolean=false;
  storageDirectory: string = '';
  dataSource:any=[];
  private host = window.location.hostname;
  private port = window.location.port;
  private protocol = window.location.protocol;
  isBrowser:boolean=false;
  fileList:any=[];
  model:any={};
  issue_status_list:any;
  issue_type_list:any;
  issue_category_list:any;
  product_list:any;
  queue_list:any;
  user_list:any;
  loading:any;
  loadingDoc:any;
  options:RequestOptions;
  fileDescription:any;
  formData:FormData;
  updates:any;
  addUpadates:any;
  linkedDocuments:any;
  product:any;
  root_cause:any;
  queue_root_cause_list:any;
  internal_only:any;
  update_internal:any;
  predefined_update:any;
  pre_update:any;
  internal:any;
  doc_internal:any;

  priority={
    'M':'Medium',
    'H':'High',
    'L':'Low'
  };
  constructor(public locationTracker:LocationTrackerProvider,private androidPermissions: AndroidPermissions,public platform:Platform,public http: Http, public navCtrl: NavController, public navParams: NavParams,public loadingController:LoadingController,private alertCtrl: AlertController,public geolocation:Geolocation) {
    this.id =JSON.parse(sessionStorage.getItem('clickedIssue'));
    this.getQueues();
    var a=localStorage.getItem('userData');
    console.log(a,this.id);
    this.formData=new FormData();
    if(this.platform.is('core') || this.platform.is('mobileweb'))
      this.isBrowser=true;
    }
   addFile(){
      console.log('called addFile');
      var a = document.createElement("input");
      a.setAttribute('type','file');
      a.setAttribute('multiple','true');
      document.body.appendChild(a);
      var thisRef=this;
      a.onchange=function(){
      thisRef.fileList=[];
      thisRef.fileList=a.files;
      console.log(thisRef.fileList);
        if(thisRef.fileList.length>0){
          for(var i=0;i<thisRef.fileList.length;i++){
          thisRef.formData.append('file_name',thisRef.fileList[i]);
        console.log(thisRef.fileList);
      }
    }   
  };
    a.click();
  }
  getQueues(){
    var link = '/rt/api/v1.0/queues';
    this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
        this.queue_list = data.queue_list;
        console.log("Queue",data);
        //this.idjson =JSON.parse(sessionStorage.getItem('clickedIssue'));
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
        ;
    });
  }
  refreshData(data:any[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
}
  submitFile(){
    var uploading = this.loadingController.create({content: `uploading...`, });
    uploading.present();
    var link = '/rt/api/v1.0/issues/'+this.id.id+'/documents';
        this.formData.append("description",this.fileDescription);
        if(this.internal == 'true')
            this.doc_internal = true;
          else
            this.doc_internal = false;
        this.formData.append("internal_only",this.doc_internal);
       // this.formData.append("category_id","2");
        console.log(this.formData);
        this.http.post(link,this.formData)
        .map(res => res.json())
        .subscribe(data => {
          uploading.dismiss();
        console.log(data);  
        this.fileList=[];
        this.formData=new FormData();
        this.loadingDocument();
    },  error => {
      uploading.dismiss();
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
  /*clickedSms(a){
    console.log(a.currentTarget.checked);
    var form=new FormData();
    form.append("require_sms_alerts",a.currentTarget.checked);
    var link = '/rt/api/v1.0/issues/'+this.id.id;
    this.http.put(link,form)
    .subscribe(data => {
     console.log(data);
    }, error => {
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.presentAlert(JSON.parse(error).msg+" please relogin");
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
  }*/
  ionViewDidEnter() {
    this.id =JSON.parse(sessionStorage.getItem('clickedIssue'));
    this.loadingDocument();
    this.loadingUpdates();
    this.loadingMasterList();
    this.getPreUpdate();
  }

  edit(){
  	this.navCtrl.push('EditIssuePage');
  }
  getPreUpdate(){
    this.http.get("/admin/api/v1.0/predefined_updates")
    .pipe(map((response:Response)=>response.json()))
    .subscribe(data=>{
      console.log(data);
      this.predefined_update=data['updates_list'];
      console.log(this.predefined_update);});
      this.pre_update="";
  }

  addUpdates(){
    //this.stages.filter(stage=>stage.id==next_status)[0].description;
    this.loadingDoc = this.loadingController.create({ 
      content: `Updating Please wait ...`, }
      );
      this.loadingDoc.present();
        console.log(this.internal_only);
        console.log(this.pre_update);
        let headers: any = new Headers();
        headers.append('Content-Type', 'Application/json');
        this.options= new RequestOptions({ headers: headers });
        var link = '/rt/api/v1.0/issues/'+this.id.id+'/updates';
        if(this.internal_only == 'true')
            this.update_internal = true;
          else
            this.update_internal = false;

        if(this.isBrowser){
          this.http.post(link,{"remarks":this.addUpadates,"internal_only":this.update_internal,"predefined_update_id":this.pre_update,"update_by_mobile_app":false,"update_by_mail":false},this.options)
          .map(res => res.json())
              .subscribe(data => {
              console.log(data);  
              this.addUpadates ='';
              this.internal_only=null;
              this.pre_update=null;
              this.loadingDoc.dismiss();
              this.loadingUpdates();
          },error => {
              this.loadingDoc.dismiss();
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
        } else{   
            this.geolocation.getCurrentPosition().then((resp) => {
              var latitude = resp.coords.latitude;
              var longitude = resp.coords.longitude;
              var gps_cordinates = "latitude:"+latitude+",longitude:"+longitude;
              this.http.post(link,{"remarks":this.addUpadates,"internal_only":this.update_internal,"predefined_update_id":this.pre_update,"gps_coordinates":gps_cordinates,"update_by_mobile_app":true,"update_by_mail":false},this.options)
              .map(res => res.json())
              .subscribe(data => {
              console.log(data);  
              this.addUpadates ='';
              this.internal_only=null;
              this.pre_update=null;
              this.loadingDoc.dismiss();
              this.loadingUpdates();
          },error => {
              this.loadingDoc.dismiss();
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
              //this.postGPS(resp.coords.latitude,resp.coords.longitude);
             }).catch((error) => {
               console.log('Error getting location', error);
             });
      }

  }

  loadingDocument(){
        this.loading = this.loadingController.create({ 
        content: `Page Loading...`, }
        );
        this.loading.present();
        console.log('ionViewDidLoad UpdateRequestPage');
        var link = '/rt/api/v1.0/issues/'+this.id.id+'/documents';
        this.http.get(link)
        .map(res => res.json())
        .subscribe(data => {
        console.log(data);  
        this.linkedDocuments = data.rt_doc_list;
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

  loadingUpdates(){
        this.loadingDoc = this.loadingController.create({ 
        content: `Page Loading...`, }
        );
        this.loadingDoc.present();
        console.log('ionViewDidLoad UpdateRequestPage');
        var link = '/rt/api/v1.0/issues/'+this.id.id+'/updates';
        this.http.get(link)
        .map(res => res.json())
        .subscribe(data => {
        console.log(data);  
        this.updates = data.updates;
        this.refreshData(this.updates);
        this.loadingDoc.dismiss();
    },  error => {
        this.loadingDoc.dismiss();
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
  ngAfterViewInit() {
    this.refreshData(this.dataSource);
    
  }
  loadingMasterList(){
            console.log('ionViewDidLoad CreateRequestPage');
            var link = '/rt/api/v1.0/queues/'+this.id.q_id+'/all_masters_list';
            this.http.get(link)
            .map(res => res.json())
            .subscribe(data => {
            this.issue_status_list = data.issue_status_list;
            this.issue_type_list = data.issue_type_list;
            console.log(this.issue_type_list);
            this.product_list = data.product_list;
            this.queue_root_cause_list = data.queue_root_cause_list;
            console.log(this.queue_root_cause_list);
            if(this.id.root_cause_id)
            {
              console.log(this.root_cause);
               this.root_cause = this.getDimensionsByFind(Number(this.id.root_cause_id),this.queue_root_cause_list).cause;
            }
            if(this.id.product_id){
              this.product = this.getDimensionsByFind(Number(this.id.product_id),this.product_list).description;

            }
            this.queue_list = data.queue_list;
            //var selectSms=this.queue_list.filter(element => element.id == this.id.queue_id)[0].update_sms_alert;
           /* if(selectSms)
            {
              //if(this.id.contact_no.requestor)
              console.log(selectSms);
              if(Number(this.id.requestor)>99)
                this.req=true
              else
                this.cont=true;
            }*/
            this.user_list = data.user_list;
            this.issue_category_list = data.issue_category_list;
            console.log(this.issue_status_list);
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
     getDimensionsByFind(id,array){
      return array.find(x => x.id === id);
    }
  downloadFile(res){ 
    var url=JSON.parse(localStorage.getItem('url'));
    var link=url+'/rt/api/v1.0/archival_docs_from_rt/'+res.id;   
     if(this.platform.is('android') || this.platform.is('ios')){
  this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
          if (status.hasPermission) {
              this.downloadDocOnAndroid(link,res);
          }
          else {
            
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
                  .then(status => {
                      if (status.hasPermission) {
                         this.downloadDocOnAndroid(link,res);
                      }
                  });
          }
      });
    }
    else{
      var downloading = this.loadingController.create({content: `Loading...`, });
      downloading.present();
      var a = document.createElement("a");
      document.body.appendChild(a);
      var request = new XMLHttpRequest ();

      request.open ( "GET",link );
      let currentUser = JSON.parse(localStorage.getItem('userData'));
      request.setRequestHeader ( 'Authorization','Bearer ' + currentUser.access_token);
      request.responseType = 'blob';
      request.onload = function (e) { 
      console.log(this.response);
      if(this.status==200){
        var file = new Blob ([this.response], {type: this.response.type });
        var fileurl = window.URL.createObjectURL (file);
        a.href=fileurl;
        a.download=res.file_name;
        downloading.dismiss();
        a.click(); 
      }
      else{
        alert(this.statusText+ " Failed to open file");
        downloading.dismiss();
      }
      };
      request.send ();
    }
  }
  downloadDocOnAndroid(link,res){
    var downloading = this.loadingController.create({content: `Loading...`, });
    downloading.present();
         var options = new RequestOptions();
      options.headers =new Headers();
      let currentUser = JSON.parse(localStorage.getItem('userData'));
      options.headers.append('Authorization','Bearer ' + currentUser.access_token);
      var fileTransfer=new FileTransferObject();
      var transfer=new FileTransfer();
      var fil=new File();  
      fileTransfer = transfer.create();
      fileTransfer.download(link, fil.externalRootDirectory +'download/' + res.file_name, true,options).then((entry) => {  
        //here logging our success downloaded file path in mobile.
        this.presentAlert('download completed: please check your download folder')
        downloading.dismiss();
    }, error=> {  
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + error); 
        downloading.dismiss(); 
        this.presentAlert('download failed');
    });
  }
  presentAlert(subTitleMessage) {
  let alert = this.alertCtrl.create({
    subTitle: subTitleMessage,
    buttons: ['OK']
  });
  alert.present();
}
updateFormat(d){
  var toLocal=(new Date(d));
  toLocal=new Date(toLocal.setMinutes(toLocal.getMinutes()+660))
  var req=toLocal.toISOString().substr(0,10)+" "+toLocal.toISOString().slice(11,16);   
  return req;
}
updateDocInternal_only(doc){
    this.formData=new FormData();
    var link = '/rt/api/v1.0/issues/'+this.id.id+'/documents/'+doc.id;
    console.log(link);
    console.log(doc.internal_only);
    this.formData.append("internal_only",doc.internal_only)
        console.log(this.formData);
        this.http.put(link,this.formData)
        .map(res => res.json())
        .subscribe(data => {
        console.log(data);  
    },  error => {
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg==" Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
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
/*updateInternal_only(update){
    this.formData=new FormData();
    var link = '/rt/api/v1.0/issues/'+this.id.id+'/updates/'+update.id;
    console.log(link);
    console.log(update.internal_only);
    this.formData.append("internal_only",update.internal_only)
        console.log(this.formData);
        this.http.put(link,this.formData)
        .map(res => res.json())
        .subscribe(data => {
        console.log(data);  
    },  error => {
      if(JSON.parse(error).msg!=undefined){
        if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired" || JSON.parse(error).msg=="Signature verification failed"){
          this.presentAlert(JSON.parse(error).msg+" please relogin");
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
}*/
}