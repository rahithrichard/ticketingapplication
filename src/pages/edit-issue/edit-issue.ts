import { Component,ElementRef,Input,ViewChild,NgZone} from '@angular/core';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,AlertController,ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { IssueListPage } from '../issue-list/issue-list';
import { m } from '@angular/core/src/render3';
import { IonicSelectableComponent } from 'ionic-selectable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
//import { MatSnackBar } from '@angular/material';
@IonicPage()
@Component({
  selector: 'page-edit-issue',
  templateUrl: 'edit-issue.html',
})
export class EditIssuePage {
 // @ViewChild('portComponent') portComponent: IonicSelectableComponent;


 // @ViewChild('fileInput') files:ElementRef;
  mindate:any;
  authForm: FormGroup;
  options: RequestOptions;
  id: any;
  issue_status_list:any;
  issue_type_list:any;
  issue_category_list:any;
  product_list:any;
  queue_list:any;
  user_list:any;
  root_cause:any;
  filteredElements:any;
  loading:any;
  selectQueue:any;
  usnHide:boolean = false;
  productHide:boolean = false;
  categoryHide:boolean = false;
  modelHide:boolean=false;
  //smsHide:boolean=false;
  typeId:boolean=false;
  oemHide:boolean = false;
  recurrenceHide:boolean = false;
  priorityHide:boolean=false;
  usnMandatory:boolean=false;
  oemMandatory:boolean=false;
  productMandatory:boolean=false;
  modelMandatory:boolean=false;
  categoryMandatory:boolean=false;
  recurrenceMandatory:boolean=false;
  typeMandatory:boolean=false;
  priorityMandatory:boolean=false;
  selectedQ:any;
  //fixedQ:any;
  idjson:any;
  getStatusFromQ:any;
  getUserData:any;
  assigneDetails:any;
  defaultRoot:any;
  defaultProduct:any;
  defaultAssignee:any;
  issue_number:any;
  disableStage:boolean = false;
  disableAssignee:boolean = false;
  fStageHide=false;
  stageHide=true;
  //onlyAssignee:boolean=false;
  Countries: any;
  currentCountry:any;
  public oem_list:any;
  enb:boolean=true;
  created_by:any;
  requested_on:any;
  selectedStage:any;
  //port: Port;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  priorityList: any = [{'text':'High','value':'H'}, {'text':'Medium','value':'M'}, {'text':'Low','value':'L'}];
  recurrence: any=  [{'text':'Once','value':'O'}, {'text':'Weekly','value':'W'}, {'text':'Monthly','value':'M'}, {'text':'Half Year','value':'H'},{'text':'Yearly','value':'Y'}]; 
  constructor(public locationTracker:LocationTrackerProvider,private httpC:HttpClient,public toastController: ToastController,public nav: NavController, public navParams: NavParams, public formBuilder: FormBuilder,public http: Http,private loadingController:LoadingController,private alertCtrl: AlertController) {
      var a=new Date().toString();
      console.log(a.substr(35).split(' ')[0]);
      this.getOemList();
     
      this.id =JSON.parse(sessionStorage.getItem('clickedIssue'));
      this.created_by=this.id.created_by;
      this.currentCountry=this.id.country!=null?this.id.country:a.substr(35).split(' ')[0];
      this.issue_number = this.id.issue_number;
        this.nav = nav;
        var reqDate = new Date();
        var lDate=new Date(this.id.created_on);
        var lDate=new Date(lDate.setMinutes(lDate.getMinutes()+660));
        var req=new Date(reqDate.getTime() - (reqDate.getTimezoneOffset() * 60000)).toISOString().substr(0,16);
        this.requested_on= lDate.toISOString().substr(0,10)+" " +lDate.toISOString().slice(11,16);
           
        this.mindate=req.substr(0,10);
        var dueDate=new Date(req);
        var dueDatetime=new Date(dueDate.setMinutes(dueDate.getMinutes()+3210)).toISOString().substr(0,16);
        console.log(this.mindate);
        console.log(dueDate);
        var reqDate = new Date(this.id.created_on);
        this.authForm = formBuilder.group({
            title: [this.id.title,[Validators.required, Validators.minLength(8), Validators.maxLength(80)]],
            unit_sr_no: [this.id.xdata2.unit_sr_no],
            due_date: [dueDatetime],
            unit_location: [this.id.unit_location,[Validators.required,Validators.minLength(8), Validators.maxLength(250)]],
            pinCode: [this.id.pin_code, [Validators.required, Validators.minLength(6),Validators.maxLength(6)]],
            email: [this.id.requestor_mail_id],
            contact: [this.id.contact_no, [Validators.required,Validators.minLength(10)]],
            priority: [this.id.xdata2.priority, [Validators.required]],
            type: [this.id.xdata2.type_id],
            status: [this.id.status,Validators.required],
            country: [{name: this.currentCountry}],
            name: [this.id.assigned_to],
            description: [this.id.description, [Validators.required]],
            product:[this.id.xdata2.product_id],
            category:[this.id.xdata2.issue_category_id],
            //file:[''],
            queue:[this.id.q_id,[Validators.required]],
            external_ids: [this.id.external_ids],
            recurrence:[this.id.xdata2.recurrence],
            
            root_cause:[this.id.root_cause_id],
            customer_name:[this.id.customer_name,[Validators.required]],
            oem_id:[this.id.xdata2.oem_id],
            model_no: [this.id.xdata2.model_no],
            //reqsms:[this.id.require_sms_alerts],
        });
        this.getCuntries();    
    }
    getOemList()
    {
      this.http.get("/admin/api/v1.0/oem")
      .pipe(map((response:Response)=>response.json()))
      .subscribe(data=>{
        console.log(data);
        this.oem_list=data['oem_list'];
        var defaultOem={id: -1, name: "None", xdata: null};
        this.oem_list.push(defaultOem);
        this.oem_list.reverse();
        console.log(this.oem_list);
      },err=>{
        console.log(err);
      });
    }
    portChange(event: {
      component: IonicSelectableComponent,
      value: any 
    }) {
      console.log('port:', event.value);
    }
    getCuntries()
{
     this.httpC.get('https://restcountries.eu/rest/v2/all')
     .subscribe((data)=> {
       
       console.log(data);
       this.Countries=data;
       
     });
    /* this.httpC.get('http://ip-api.com/json')
     .subscribe((data)=> {
       console.log(data);
       
     });*/
    
}
async presentToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 5000
  });
  toast.present();
}
  ionViewDidEnter(){
      this.loading = this.loadingController.create({content: `Page Loading...`, });
      this.loading.present();
      var link = '/rt/api/v1.0/queues';
      this.http.get(link)
      .map(res => res.json())
      .subscribe(data => {
          this.queue_list = data.queue_list;
          console.log("Queue",data);
          this.idjson =JSON.parse(sessionStorage.getItem('clickedIssue'));
          this.loading.dismiss();
          this.selectedQ = this.idjson.q_id;
          //this.fixedQ=this.idjson.q_id;
          this.loadMasterList(this.selectedQ);
      },  error => {
        this.loading.dismiss()
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
  
  loadMasterList(id:any):void{
    this.loading = this.loadingController.create({content: `Page Loading...`, });
    var link = '/rt/api/v1.0/queues/'+id+'/all_masters_list';
    this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
    //this.issue_status_list = data.issue_status_list;
    console.log(data);
    this.issue_type_list = data.issue_type_list;
    var defaultType={type:"None", id: -1,  name: "None", xdata: null};
    this.issue_type_list.push(defaultType);
    this.issue_type_list.reverse();
    this.product_list = data.product_list;
    this.defaultProduct = {description: "None", id: -1, list_price: null, name: "None", xdata: null}
    this.product_list.push(this.defaultProduct);
    this.product_list.reverse();
    console.log("Root product_list:",this.product_list);
    this.issue_category_list = data.issue_category_list;
    var defaultCategory={description: "None", id: -1,name:"None", xdata: null};
    this.issue_category_list.push(defaultCategory);
    this.issue_category_list.reverse();
    this.root_cause = data.queue_root_cause_list;
    console.log(data.queue_root_cause_list);
    this.defaultRoot = {cause: "None", id:-1, name: "Installation Queue", queue_id: 1, xdata: null};
    this.root_cause.push(this.defaultRoot);
    this.root_cause.reverse();
    console.log("Root Couse:",this.root_cause);
    this.id =JSON.parse(sessionStorage.getItem('clickedIssue'));
    this.filteredElements=this.root_cause.filter(element => element.queue_id == id);
    console.log(this.filteredElements);
    this.selectQueue=this.queue_list.filter(element => element.id == id);
    this.oemHide = false;
    this.productHide = false;
    this.recurrenceHide = false;
    this.usnHide = false;
    this.categoryHide =false;
    this.typeId=false;
    //this.smsHide=false;
    /*if(this.selectQueue[0].update_sms_alert)
    {
      this.smsHide=false;
    }
    else
      this.smsHide=true;*/
    if(this.selectQueue[0].xdata){
      if(this.selectQueue[0].xdata.oem_name == 'show'){
          this.oemHide = false;
      } 
      else 
        this.oemHide = true;
      if(this.selectQueue[0].xdata.product_id == 'show'){
        this.productHide = false;
      } 
      else this.productHide = true;
      if(this.selectQueue[0].xdata.recurrence == 'show'){
        this.recurrenceHide = false;
      } 
      else 
        this.recurrenceHide = true;
      if(this.selectQueue[0].xdata.unit_sr_no == 'show'){
        this.usnHide = false;
      } 
      else 
        this.usnHide = true;
      if(this.selectQueue[0].xdata.issue_category_id == 'show'){
        this.categoryHide = false;
      } 
      else 
        this.categoryHide = true;
      if(this.selectQueue[0].xdata.type_id=='show')
      {
        this.typeId= false;
      }
      else 
        this.typeId = true;
      if(this.selectQueue[0].xdata.priority == 'show'){
        this.priorityHide = false;
      }
      else 
        this.priorityHide = true;
      if(this.selectQueue[0].xdata.model_no == 'show'){
        this.modelHide = false;
      } 
      else 
        this.modelHide = true;
      if(this.selectQueue[0].xdata.is_mandatory_unit_sr_no){
        this.usnMandatory = true;
      } 
      else 
        this.usnMandatory = false;

      if(this.selectQueue[0].xdata.is_mandatory_model_no){
        this.modelMandatory = true;
      } 
      else 
        this.modelMandatory = false;

      if(this.selectQueue[0].xdata.is_mandatory_oem_name){
        this.oemMandatory = true;
      } 
      else 
        this.oemMandatory = false;
      if(this.selectQueue[0].xdata.is_mandatory_product){
        this.productMandatory = true;
      } 
      else 
        this.productMandatory = false;
      if(this.selectQueue[0].xdata.is_mandatory_recurrence){
        this.recurrenceMandatory = true;
      } 
      else 
        this.recurrenceMandatory = false;
      if(this.selectQueue[0].xdata.is_mandatory_priority){
        this.priorityMandatory = true;
      } 
      else 
        this.priorityMandatory = false;
      if(this.selectQueue[0].xdata.is_mandatory_issue_category_id){
        this.categoryMandatory = true;
      } 
      else 
        this.categoryMandatory = false;
      if(this.selectQueue[0].xdata.is_mandatory_type){
        this.typeMandatory = true;
      } 
      else 
        this.typeMandatory = false;
    }
    console.log(this.root_cause);
    this.loading.dismiss();
    if(this.selectedQ==this.id.q_id)
      this.statusQueue();
    else
      this.changeQueueStage();
    },  
    error => {
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
    this.getAssignee(this.selectedQ,this.id.status); 
  }

  onSubmit(value: any): void {
    this.getUserData = JSON.parse(localStorage.getItem('userData'));
    let headers: any = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    this.options = new RequestOptions({ headers: headers });
    //let inputEl: HTMLInputElement = this.files.nativeElement;
    console.log(value);
    let formData=new FormData();
    if(typeof value.status!='undefined' && value.status && value.status!=this.id.status){
      formData.append('status',value.status);
    } 
    /*else
    {
      this.onlyAssignee=true;
    }*/
    if(typeof value.name!='undefined' && value.name  && value.name!='-1' && value.name!="None"){
      //console.log("assigned_by ",value.name.assignee_group);
      this.assigneDetails =this.user_list.filter(element => element.assigned_to == value.name);
      //console.log(this.assigneDetails[0].assignee_group);
      formData.append('assignee_group',this.assigneDetails[0].assignee_group);
      //formData.append('assigned_by',value.name.user_name);
      formData.append('assigned_to',value.name);
     // this.onlyAssignee=true;
    } 
    else if(value.name=="None" && this.id.assigned_to!=null){
      formData.append('assignee_group','');
      formData.append('assigned_to','');
    }
    else{
      console.log("assigned_by ",value.name);
      
    }


    if(typeof value.title!='undefined' && value.title && value.title!=this.id.title){
      formData.append('title',value.title);
      //this.onlyAssignee=false;
    } 
    if(typeof value.country.name!='undefined' && value.country.name && value.country.name!=this.id.country){
      formData.append('country',value.country.name);
      //this.onlyAssignee=false;
    }
    if(typeof value.description!='undefined' && value.description && value.description!=this.id.description){
      formData.append('description',value.description);
      //this.onlyAssignee=false;
    } 
    else if(value.description==="")
    formData.append('description','None');

    if(typeof value.email!='undefined' && value.email && value.email!=this.id.requestor_mail_id){
      formData.append('requestor_mail_id',value.email);
      //this.onlyAssignee=false;
    } 
    else if(value.email==="")
      formData.append('requestor_mail_id','None');


    formData.append('queue_id',this.selectedQ);

    if(value.type!='undefined' && value.type && value.type!=this.id.xdata2.type_id && value.type!='-1'){
      formData.append('type_id',value.type);
      //this.onlyAssignee=false;
    } 
    if(value.model_no!='undefined' && value.model_no && value.model_no!=this.id.xdata2.model_no ){
      formData.append('model_no',value.model_no);
      //this.onlyAssignee=false;
    } 

    formData.append('requestor_id',this.getUserData.id);

    if(value.unit_sr_no!='undefined' &&  value.unit_sr_no!=this.id.xdata2.unit_sr_no){
      formData.append('unit_sr_no',value.unit_sr_no);
      //this.onlyAssignee=false;
    } 
    else{
      console.log("unit_sr_no ",value.unit_sr_no);
    }
    
    if(value.category!='undefined' && value.category && value.category!= this.id.xdata2.issue_category_id && value.category!='-1'){
      formData.append('issue_category_id',value.category);
   //   this.onlyAssignee=false;
    } 
    else{
      console.log("category ",value.category);

    }
    if(value.oem_id!='undefined' && value.oem_id && value.oem_id!=this.id.xdata2.oem_id && value.oem_id!='-1'){
      formData.append('oem_id',value.oem_id);
   //   this.onlyAssignee=false;
    } 
    //else if(value.oem_id==="")
    //formData.append('oem_id','None');

    if(value.recurrence!='undefined' && value.recurrence && value.recurrence!=this.id.xdata2.recurrence){
      formData.append('recurrence',value.recurrence);
     // this.onlyAssignee=false;
    } 
    else{
      console.log("recurrence ",value.recurrence);

    }
    if(value.product!='undefined' && value.product && value.product!=this.id.xdata2.product_id && value.product!='-1'){
     formData.append('product_id',value.product);
    // this.onlyAssignee=false;
    } 
    else{
      console.log("product ",value.product);

    }
    if(typeof value.root_cause!='undefined' && value.root_cause && value.root_cause!=this.id.root_cause_id){
    formData.append('root_cause_id',value.root_cause);
    //this.onlyAssignee=false;
    } 
    else{
      console.log("root_cause ",value.root_cause);

    }

    //formData.append('cc_user_ids','shantala@gmail.in, abc@gmail.com');
    if(typeof value.priority!='undefined' && value.priority && value.priority!=this.id.xdata2.priority ){
      formData.append('priority',value.priority);
    } 

    if(typeof value.external_ids!='undefined' && value.external_ids && value.external_ids!=this.id.external_ids){
      formData.append('external_ids',value.external_ids);
     // this.onlyAssignee=false;
    }   else if(value.external_ids==="")
    formData.append('external_ids','None');

    if(typeof value.due_date!='undefined' && value.due_date && value.due_date!=this.id.due_date){
      formData.append('due_date',value.due_date.substr(0,16));
      console.log(value.due_date);
     // this.onlyAssignee=false;
    } 
   /* if(typeof value.requested_on!='undefined' && value.requested_on && value.requested_on!=this.id.requested_on){
      formData.append('requested_on',value.requested_on.substr(0,16));
      console.log(value.requested_on);
      this.onlyAssignee=false;
    } */
    if(typeof value.unit_location!='undefined' && value.unit_location && value.unit_location!=this.id.unit_location){
      formData.append('unit_location',value.unit_location);
     // this.onlyAssignee=false;
    } 
    if(typeof value.pinCode!='undefined' && value.pinCode && value.pinCode!=this.id.pin_code){
      formData.append('pin_code',value.pinCode);
    //  this.onlyAssignee=false;
    } 
    if(typeof value.contact!='undefined' && value.contact && value.contact!=this.id.contact_no){
      formData.append('contact_no',value.contact);
    //  this.onlyAssignee=false;
    } 
    if(typeof value.customer_name!='undefined' && value.customer_name && value.customer_name!=this.id.customer_name){
      formData.append('customer_name',value.customer_name);
      //this.onlyAssignee=false;
    } 
    /*if(!this.smsHide && value.reqsms!=this.id.require_sms_alerts){
      formData.append('require_sms_alerts',value.reqsms);
      this.onlyAssignee=false;
    }*/
    console.log(formData);
 
    /*if(this.onlyAssignee){
            var link = '/rt/api/v1.0/queues/'+this.selectedQ+'/status/'+this.id.status+'/q_role_user_assignee';
            //var data = JSON.stringify();
            this.http.get(link)
            .map(res => res.json())
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
    }else
    {*/
        if(this.authForm.valid) {
			      let headers: any = new Headers();
            var link = '/rt/api/v1.0/issues/'+this.id.id;
            console.log(link);
                //var data = JSON.stringify();
                this.http.put(link, formData)
                .subscribe(data => {
                 console.log(data);
                 //this.presentAlert(data['ok']);
                  this.presentToast("Issue Number "+this.issue_number+" is edited");
                 
                /* var start = new Date().getTime();
                 var end = start;
                 while(end < start + 4000) {
                   end = new Date().getTime();
                }*/
                 this.nav.push('IssueListPage');

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
        }
      //}
   }
   numb(n)
   {
     //console.log(Number(n));
     if(Number(n)>0){
       console.log(Number(n));
       return Number(n);
       
     }
     console.log(false);
       return 0;
       

   }


    getAssignee(selectedQ,statusId){
            var link = '/rt/api/v1.0/queues/'+selectedQ+'/status/'+statusId+'/q_role_user_assignee';
            //var data = JSON.stringify();
            this.user_list=[];
            this.http.get(link)
            .map(res => res.json())
            .subscribe(data => {
             console.log(data);
             this.user_list=data.assignee_list;
             console.log(this.user_list);
             this.defaultAssignee = {assigned_to: -1, assignee: "None", assignee_group: -1, group: ""};
             this.user_list.push(this.defaultAssignee);
             this.user_list.reverse();
            }, error => {
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
    selectedStatus(statusId){
            //this.disableAssignee=true;
            this.authForm.controls.name.setValue("None");
            var link = '/rt/api/v1.0/queues/'+this.selectedQ+'/status/'+statusId+'/q_role_user_assignee';
             this.user_list=[];
            this.http.get(link)
            .map(res => res.json())
            .subscribe(data => {
             console.log(data.assignee_list);
             this.user_list=data.assignee_list;
             this.defaultAssignee = {assigned_to: -1, assignee: "None", assignee_group: -1, group: ""};
             this.user_list.push(this.defaultAssignee);
             this.user_list.reverse();
            }, error => {
              if(JSON.parse(error).msg!=undefined){
                if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired"  || JSON.parse(error).msg=="Signature verification failed"){
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
   onChange($event){
     console.log($event);
     this.selectedQ  = $event;
     this.authForm.controls.status.setValue(null);
       this.loadMasterList($event);
       //this.loadMasterList(this.selectedQ);
  }
  //this is for changed Queue 
  changeQueueStage(){
    this.fStageHide=true;
    this.stageHide=false;
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: headers });
    var link = '/rt/api/v1.0/queues/'+this.selectedQ+'/rt_status';
    this.http.get(link)
    .map(res=>res.json())
    .subscribe(data=>{  
    console.log(data);
    if(data.status_list.length>0){
    this.issue_status_list=data.status_list.filter(element => element.is_first_status == true);
    }
    },
    error=>{
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
    }) 
  } 
  //this is for same Queue
    statusQueue(){
      this.stageHide=true;
      this.fStageHide=false;
    
      let headers: any = new Headers();
      headers.append('Content-Type', 'application/json');
      this.options = new RequestOptions({ headers: headers });
      var link = '/rt/api/v1.0/rt_issues/'+this.id.id+'/status/'+this.id.status+'/get_previous_next_stage';
      console.log(link);
      this.http.get(link)
      .map(res=>res.json())
      .subscribe(data=>{  
          //this.getStatusFromQ=data.relative_stages.filter(element => element.is_first_status == true);
          this.issue_status_list = data.relative_stages;
          console.log(this.issue_status_list);
          //this.updateUI(this.selectedQ);
      },
      error=>{
       // this.loading.dismiss();
        console.log(error);
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
      })   
  }
  presentAlert(subTitleMessage) {
  let alert = this.alertCtrl.create({
    subTitle: subTitleMessage,
    buttons: ['OK']
  });
  alert.present();
  }
     /* updateUI(value:any):void{
      this.oemHide = false;
      this.productHide = false;
      this.recurrenceHide = false;
      this.usnHide = false;
      this.categoryHide =false;
      this.selectQueue=this.queue_list.filter(element => element.id == value);
      if(this.selectQueue[0].xdata){
       console.log("");
       console.log("Queue List :",this.selectQueue[0].xdata.oem_name);
       if(this.selectQueue[0].xdata.oem_name == 'show'){
          this.oemHide = false;
       } else this.oemHide = true;
       if(this.selectQueue[0].xdata.product_id == 'show'){
          this.productHide = false;
       } else this.productHide = true;
       if(this.selectQueue[0].xdata.recurrence == 'show'){
          this.recurrenceHide = false;
       } else this.recurrenceHide = true;
       if(this.selectQueue[0].xdata.unit_sr_no == 'show'){
          this.usnHide = false;
       } else this.usnHide = true;
       if(this.selectQueue[0].xdata.issue_category_id == 'show'){
          this.categoryHide = false;
       } else this.categoryHide = true;

      }
       this.selectedStatus(this.getStatusFromQ[0].id);

    }*/

 /* selectedAssignee(){
    this.disableStage=true;
  }*/
}