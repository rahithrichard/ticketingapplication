import { Component,ElementRef,Input,ViewChild} from '@angular/core';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController ,AlertController,ToastController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { IssueListPage } from '../issue-list/issue-list';
import { IonicSelectableComponent } from 'ionic-selectable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { a } from '@angular/core/src/render3';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
@IonicPage()
@Component({
  selector: 'page-create-request',
  templateUrl: 'create-request.html',
})
export class CreateRequestPage {
  @ViewChild('fileInput') files:ElementRef;
  //@ViewChild('fileCSV') filesCsv:ElementRef;

  mindate:any;
  authForm: FormGroup;
  options: RequestOptions;
  issue_status_list:any;
  issue_type_list:any;
  issue_category_list:any;
  product_list:any;
  queue_list:any;
  user_list:any;
  loading:any;
  defaultRoot:any;
  defaultAssignee:any;
  root_options:any;
  filteredElements:any;
  root_cause:any;
  selectQueue:any;
  disable:boolean = true;
  usnHide:boolean = false;
  productHide:boolean = false;
  categoryHide:boolean = false;
  oemHide:boolean = false;
  modelHide:boolean=false;
  priorityHide:boolean=false;
  recurrenceHide:boolean = false;
  usnMandatory:boolean=false;
  oemMandatory:boolean=false;
  productMandatory:boolean=false;
  modelMandatory:boolean=false;
  categoryMandatory:boolean=false;
  recurrenceMandatory:boolean=false;
  typeMandatory:boolean=false;
  priorityMandatory:boolean=false;
  typeId:boolean=false;
  selectedQ:any;
  getStatusFromQ:any[];
  selectedStatuss:string;
  getUserData:any;
  defaultProduct:any;
  user:any;
  csvFile:FormControl=new FormControl();
  emailCommaSep="^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  pincodePattern = "/^[0-9]{1,6}$/";
  priority: any = [{'text':'High','value':'H'}, {'text':'Medium','value':'M'}, {'text':'Low','value':'L'}];
  recurrence: any=  [{'text':'Once','value':'O'}, {'text':'Weekly','value':'W'}, {'text':'Monthly','value':'M'}, {'text':'Half Year','value':'H'},{'text':'Yearly','value':'Y'}];
  currentCountry:any;
  Countries: any;
  public oem_list:any;
  created_by:any;
  requested_on:any;
  constructor(public locationTracker:LocationTrackerProvider,private httpC:HttpClient,public toastController: ToastController,public nav: NavController, public navParams: NavParams, public formBuilder: FormBuilder,public http: Http, public loadingController:LoadingController,private alertCtrl: AlertController) {
        this.user = JSON.parse(localStorage.getItem('userData'));    
        var userMail=this.user.email;
        //var userMobile=this.user.mobile;
        this.created_by=userMail;
        var a=new Date().toString();
        console.log(a.substr(35).split(' ')[0]);
        this.currentCountry=a.substr(35).split(' ')[0];
        this.nav = nav;
        var reqDate = new Date();
        var req=new Date(reqDate.getTime() - (reqDate.getTimezoneOffset() * 60000)).toISOString().substr(0,16);
        this.requested_on= req.substr(0,10)+" " +req.substr(11,16);;
        this.mindate=req.substr(0,10);
        var dueDate=new Date(req);
        var dueDatetime=new Date(dueDate.setMinutes(dueDate.getMinutes()+3210)).toISOString().substr(0,16);
        this.authForm = formBuilder.group({
        title: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(80)]],
        unit_sr_no: [''],
        due_date: [dueDatetime],
            unit_location: ['',[Validators.required,Validators.minLength(8), Validators.maxLength(250)]],
            pinCode: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(6)]],
            country: [{name: this.currentCountry}],
            email: [userMail],
            contact: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(12)]],
            priority: ['M', [Validators.required]],
            type: [''],
            status: [this.selectedStatuss],
            name: [''],
            description: ['', [Validators.required]],
            product:[''],
            category:[''],
            file:[''],
            queue:['',[Validators.required]],
            external_ids: ['',[Validators.pattern(this.emailCommaSep)]],
            recurrence:['O'],
            root_cause:[''],
            customer_name:['',[Validators.required]],
            oem_id:[''],
            model_no: [''],
        });
        this.getCuntries();
        this.getOemList();
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
  ionViewDidLoad(){
      this.loading = this.loadingController.create({content: `Page Loading...`, });
      this.loading.present();
      var link = '/rt/api/v1.0/queues';
      this.http.get(link)
      .map(res => res.json())
      .subscribe(data => {
          this.queue_list = data.queue_list;
          console.log("Queue",data);
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
}
async presentToast(msg) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 5000,
  });
  toast.present();
}
  loadMasterList(id:any):void
  {
      this.loading = this.loadingController.create({content: `Page Loading...`, });
      this.loading.present();
      var link = '/rt/api/v1.0/queues/'+id+'/all_masters_list';
      this.http.get(link)
      .map(res => res.json())
      .subscribe(data => {
          this.issue_status_list = data.issue_status_list;
          this.issue_type_list = data.issue_type_list;
          var defaultType={type:"None", id: -1,  name: "None", xdata: null};
          this.issue_type_list.push(defaultType);
          this.issue_type_list.reverse();
          this.product_list = data.product_list;
          console.log(Object.keys(data.product_list).length)
          this.defaultProduct = {description: "None", id: -1, list_price: null, name: "None", xdata: null}
          this.product_list.push(this.defaultProduct);
          this.product_list.reverse();
          console.log("Root product_list:",this.product_list);
          this.root_cause = data.queue_root_cause_list;
          this.defaultRoot = {cause: "None", id:-1, name: "Installation Queue",queue_id: 1, xdata: null};
          this.root_cause.push(this.defaultRoot);
          this.root_cause.reverse();
          this.issue_category_list = data.issue_category_list;
          var defaultCategory={description: "None", id: -1,name: "None", xdata: null};
          this.issue_category_list.push(defaultCategory);
          this.issue_category_list.reverse();
          console.log("Queue",data);
          console.log(data);
          this.loading.dismiss();
          this.statusQueue();
      },  error => {
          this.loading.dismiss();
          if(JSON.parse(error).msg!=undefined){
            if(JSON.parse(error).msg=="Token has expired" || JSON.parse(error).msg=="The access token has expired"|| JSON.parse(error).msg=="Signature verification failed"){
              this.presentAlert(JSON.parse(error).msg+" Redirecting to login page");
              this.locationTracker.goToLogin();
            } 
            else{
              this.presentAlert(JSON.parse(error).msg);
            }
          }
          else{
            this.presentAlert(JSON.parse(error).message);
            console.log("Oooops!"+error);
          }
      });
  }

    selectedQueue(value: any): void {
      this.selectedQ  = value;
    }

  updateUI(value:any):void
  {
    this.selectedQ = value;
    this.oemHide = false;
    this.productHide = false;
    this.recurrenceHide = false;
    this.usnHide = false;
    this.categoryHide =false;
    this.modelHide = false;
    this.filteredElements=this.root_cause.filter(element => element.queue_id == value);
    this.selectQueue=this.queue_list.filter(element => element.id == value);
    console.log(this.selectQueue);
    this.disable=false;
    console.log("Queue List :",this.selectQueue[0].xdata);
      if(this.selectQueue[0].xdata){
         if(this.selectQueue[0].xdata.oem_name == 'show'){
            this.oemHide = false;
         } 
         else 
            this.oemHide = true;
         if(this.selectQueue[0].xdata.product_id == 'show'){
            this.productHide = false;
         } 
         else 
            this.productHide = true;
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
        if(this.selectQueue[0].xdata.priority == 'show'){
          this.priorityHide = false;
        }
        else 
          this.priorityHide = true;
        if(this.selectQueue[0].xdata.issue_category_id == 'show'){
          this.categoryHide = false;
        } 
        else 
          this.categoryHide = true;
        if(this.selectQueue[0].xdata.model_no == 'show'){
          this.modelHide = false;
        } 
        else 
          this.modelHide = true;
        if(this.selectQueue[0].xdata.type_id=='show')
        {
           this.typeId= false;
        }
        else 
          this.typeId = true;
          
        if(this.selectQueue[0].xdata.is_mandatory_model_no){
            this.modelMandatory = true;
          } 
        else 
          this.modelMandatory = false;
        if(this.selectQueue[0].xdata.is_mandatory_unit_sr_no){
          this.usnMandatory = true;
        } 
        else 
          this.usnMandatory = false;

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
      if(this.getStatusFromQ)
        this.selectedStatus(this.getStatusFromQ[0].id);
    }
  onSubmit(value: any): void {
    var uploading = this.loadingController.create({content: `uploading...`, });
    uploading.present();
    this.getUserData = JSON.parse(localStorage.getItem('userData'));
    let headers: any = new Headers();
    //headers.append('Content-Type', 'multipart/form-data');
    headers.append('Creation-Mode','gui');
    let options = new RequestOptions({ headers: headers });
    let inputEl: HTMLInputElement = this.files.nativeElement;
    let fileCount: number = inputEl.files.length;
    let formData=new FormData();
    formData.append('title',value.title);
   formData.append('country',value.country.name);
    formData.append('description',value.description);
    formData.append('requestor_mail_id',value.email);
    //formData.append('created_by',value.created_by);
    formData.append('queue_id',this.selectedQ);
    if(value.type!='undefined' && value.type!='' &&  value.type!='-1'){
      formData.append('type_id',value.type);
    }
    formData.append('status','1');
    formData.append('requestor_id',this.getUserData.id);
    if(typeof value.name!='undefined' && value.name && value.name.assigned_to!=-1 && value.name!='-1'){
      console.log("assigned_by ",value.name.assignee_group);
      formData.append('assignee_group',value.name.assignee_group);
      //formData.append('assigned_by',value.name.user_name);
      formData.append('assigned_to',value.name.assigned_to);
    } 
    else{
      console.log("assigned_by ",value.name);
    }
    if(value.unit_sr_no!='undefined' && value.unit_sr_no!=''){
      formData.append('unit_sr_no',value.unit_sr_no);
    } 
    else{
      console.log("unit_sr_no ",value.unit_sr_no);
    }
    if(value.category!='undefined' && value.category!=''   && value.category!='-1'){
      formData.append('issue_category_id',value.category);
    } 
    else{
      console.log("category ",value.category);

    }
    if(value.oem_id!='undefined' && value.oem_id!='' && value.oem_id!='-1'){
      formData.append('oem_id',value.oem_id);
    } 
    else{
      console.log("oem_id ",value.oem_id);

    }
    if(value.recurrence!='undefined' && value.recurrence!=''){
      formData.append('recurrence',value.recurrence);
    } 
    else{
      console.log("recurrence ",value.recurrence);

    }
    if(value.product!='undefined' && value.product!='' && value.product!=-1){
     formData.append('product_id',value.product);
    } 
    else{
      console.log("product ",value.product);
    }
    if(value.model_no!='undefined' && value.model_no!=''){
      formData.append('model_no',value.model_no);
     } 
     else{
       console.log("product ",value.model_no);
     }
    if(typeof value.root_cause!='undefined' && value.root_cause && value.root_cause!=-1){
    formData.append('root_cause_id',value.root_cause);
    } 
    else{
      console.log("root_cause ",value.root_cause);
    }
    //formData.append('cc_user_ids','shantala@gmail.in, abc@gmail.com');
    if(value.priority!='undefined' && value.priority!=''){
      formData.append('priority',value.priority);
    }
    formData.append('external_ids',value.external_ids);
    formData.append('due_date',value.due_date.substr(0,16));
    //formData.append('requested_on',value.requested_on.substr(0,16));
    formData.append('unit_location',value.unit_location);
    formData.append('pin_code',value.pinCode);
    formData.append('contact_no',value.contact);
    formData.append('customer_name',value.customer_name);
    //formData.append('creation_mode', 'gui');

    console.log(formData);
    let files :FileList = inputEl.files;   
    if(fileCount>0){
      for(var i=0;i<files.length;i++){
        formData.append('mfiles',files[i]);
      }
    }
    console.log(fileCount);
        if(this.authForm.valid){
            var link = '/rt/api/v1.0/issues_add';
            this.http.post(link, formData,options)
            .map(res=>res.json())
            .subscribe(data => {
              this.presentToast(data['message']);
            this.nav.push('IssueListPage'); 
            uploading.dismiss();
             console.log(data);
            }, error => {
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
   }
   selectedStatus(statusId){
     console.log("value selectedQ",this.selectedQ+ " statusId",statusId);
            var link = '/rt/api/v1.0/queues/'+this.selectedQ+'/status/'+statusId+'/q_role_user_assignee';
            //var data = JSON.stringify();
            console.log(link);
            this.user_list=[];
            this.http.get(link)
            .map(res => res.json())
            .subscribe(data => {
             console.log(data.assignee_list);
             if(data.assignee_list.length>0){
                console.log(data.assignee_list);
                this.user_list=data.assignee_list;
             }
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
                console.log(JSON.parse(error));
              }
              else{
                this.presentAlert(JSON.parse(error).message);
                console.log("Oooops!"+error);
              }
            });
   }

  onChange($event){
      console.log($event);
      this.loadMasterList($event);
  }  
  statusQueue(){
      let headers: any = new Headers();
      headers.append('Content-Type', 'application/json');
      this.options = new RequestOptions({ headers: headers });
      this.loading = this.loadingController.create({content: `Page Loading...`, });
      this.loading.present();
      var link = '/rt/api/v1.0/queues/'+this.selectedQ+'/rt_status';
      this.http.get(link)
      .map(res=>res.json())
      .subscribe(data=>{  
      console.log();
      if(data.status_list.length>0){
      this.getStatusFromQ=data.status_list.filter(element => element.is_first_status == true);
      console.log(this.getStatusFromQ);
      this.selectedStatuss = this.getStatusFromQ[0].description;
      console.log("status",this.selectedStatuss);
      }
      else
      {
        //need to add else condition 
      }

      this.loading.dismiss();
      this.updateUI(this.selectedQ);
      },
      error=>{
        this.loading.dismiss();
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
  /*
  onSubmitCSV(){
    var link = 'rt/api/v1.0/import_tkts_from_csv';
    console.log(this.csvFile);
    let formData=new FormData();
    let inputEl: HTMLInputElement = this.filesCsv.nativeElement;
    let fileCount: number = inputEl.files.length;
    let files :FileList = inputEl.files;   
    if(fileCount>0){
      for(var i=0;i<files.length;i++){
        formData.append('csv_inputfile',files[i]);
      }
    }
        //var data = JSON.stringify();
        this.http.post(link, formData)
        .subscribe(data => {
         console.log(data);
         this.nav.push('IssueListPage');
        }, error => {
         this.presentAlert(JSON.parse(error).message);
         console.log("Oooops!"+error);
        });
  } */
    presentAlert(subTitleMessage) {
    let alert = this.alertCtrl.create({
    subTitle: subTitleMessage,
    buttons: ['OK']
  });
  alert.present();
  }
}