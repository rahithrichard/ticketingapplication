import { Component,ElementRef,Input,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions} from '@angular/http';
import { IonicSelectableComponent } from 'ionic-selectable';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { HomePage } from '../home/home';
import { map } from 'rxjs/operators';

/**
 * Generated class for the UseUrlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-use-url',
  templateUrl: 'use-url.html',
})
export class UseUrlPage {
  @ViewChild('fileInput') files:ElementRef;
  usnMandatory:boolean=false;
  oemMandatory:boolean=false;
  productMandatory:boolean=false;
  modelMandatory:boolean=false;
  usnHide:boolean = false;
  productHide:boolean = false;
  //categoryHide:boolean = false;
  oemHide:boolean = false;
  modelHide:boolean=false;
  //recurrenceHide:boolean = false;
  //typeId:boolean=false;
  selectedQ:any;
  public oem_list:any;
  urlForm:FormGroup;
  queue_list:any;
  currentCountry:any;
  Countries: any;
  disable:boolean=true;
  public product_list:any;
  constructor(public nav: NavController,public toastController: ToastController,public location:Location,private alertCtrl: AlertController,public navCtrl: NavController,public http: Http,public formBuilder: FormBuilder,private httpC:HttpClient, public navParams: NavParams) {
    var a=new Date().toString();
    console.log(a.substr(35).split(' ')[0]);
    this.currentCountry=a.substr(35).split(' ')[0];
    this.urlForm= formBuilder.group({
      queue:['',Validators.required],
      title: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      contact: ['', [Validators.required,Validators.minLength(10)]],
      description: ['', [Validators.required,,Validators.minLength(8)]],
      unit_location: ['',[Validators.required,Validators.minLength(8), Validators.maxLength(250)]],
      pinCode: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(6)]],
      country: [{name: this.currentCountry},Validators.required],
      email: ['',Validators.required],
      unit_sr_no: [''],
      model_no: [''],
      oem_id:[''],
      file:[''],
      product_id:[''],
    });
      this.getQueue();
      this.getCuntries(); 
      this.getOemList(); 
      this.getProductList()
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
      duration: 5000
    });
    toast.present();
  }
  onChange(value){
    this.selectedQ=this.queue_list.filter(element =>element.id == value);
    this.disable=false;
    console.log(value,this.selectedQ);
    if(this.selectedQ[0].xdata){
      if(this.selectedQ[0].xdata.oem_name == 'show'){
         this.oemHide = false;
      } else this.oemHide = true;
      if(this.selectedQ[0].xdata.product_id == 'show'){
         this.productHide = false;
      } else this.productHide = true;
     if(this.selectedQ[0].xdata.model_no == 'show'){
         this.modelHide = false;
      } else this.modelHide = true;
      if(this.selectedQ[0].xdata.unit_sr_no == 'show'){
         this.usnHide = false;
      } else this.usnHide = true;

      if(this.selectedQ[0].xdata.is_mandatory_unit_sr_no){
        this.usnMandatory = true;
        console.log(this.usnMandatory);
     } 
     else this.usnMandatory = false;
     if(this.selectedQ[0].xdata.is_mandatory_model_no){
      this.modelMandatory = true;
   } 
   else this.modelMandatory = false;
   if(this.selectedQ[0].xdata.is_mandatory_oem_name){
    this.oemMandatory = true;
 } 
 else this.oemMandatory = false;
 if(this.selectedQ[0].xdata.is_mandatory_product){
  this.productMandatory = true;
} 
else this.productMandatory = false;
   }

  }
  getProductList()
  {
    this.http.get("/rt/api/v1.0/products")
    .map(res => res.json())
    .subscribe(data=>{
      console.log(data);
      this.product_list=data['product_list'];
      var defaultProduct = {description: "None", id: -1, list_price: null, name: "None", xdata: null}
      this.product_list.push(defaultProduct);
      this.product_list.reverse();
      console.log(this.product_list);
    },err=>{
      console.log(err);
    });
  }
  backPage() {
    //this.location.back();
    this.nav.setRoot(HomePage);
  }
  portChange(event: {
    component: IonicSelectableComponent,
    value: any 
  }) {
    console.log('port:', event.value.flag);
  }
  getQueue(){
    var  link = '/rt/api/v1.0/public_queues';
    console.log(link);
        this.http.get(link)
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
      var s=data['public_queue_list'].filter(x=>x.bool_public==true);
      this.queue_list=s;
      console.log(this.queue_list.length);
    },  error => {
        console.log("Oooops!"+error); 
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UseUrlPage');
  }
  getOemList()
  {
    this.http.get("/admin/api/v1.0/oem")
    .map(res => res.json())
    .subscribe(data=>{
      console.log(data);
      this.oem_list=data['oem_list'];
      var defaultOem={id: -1, name: "None",xdata:null};
      this.oem_list.push(defaultOem);
      this.oem_list.reverse();
      console.log(this.oem_list);
    },err=>{
      console.log(err);
    });
  }
  onSubmit(value){
    let formData=new FormData();
    let inputEl: HTMLInputElement = this.files.nativeElement;
    let fileCount: number = inputEl.files.length;
    console.log(value);
    formData.append('queue_id',value.queue);
    if(value.unit_sr_no!=""){
      formData.append('unit_sr_no',value.unit_sr_no);
    }
    formData.append('title',value.title);
    formData.append('unit_location',value.unit_location);
    formData.append('contact_no',value.contact);
    formData.append('requestor',value.email);
    formData.append('country',value.country.name);
    if(value.model_no!=""){
      formData.append('model_no',value.model_no);
    }
    formData.append('description',value.description);
    formData.append('pin_code',value.pinCode);
    if(value.oem_id!="" && value.oem_id!="-1"){
      formData.append('oem_id',value.oem_id);
    }
    if(value.product_id!="" && value.product_id!="-1"){
       formData.append('product_id',value.product_id);
    }
    let files :FileList = inputEl.files;   
    if(fileCount>0){
      for(var i=0;i<files.length;i++){
        formData.append('mfiles',files[i]);
      }
    }
    console.log(fileCount);
    if(this.urlForm.valid){
      var link = '/rt/api/v1.0/create_issue_without_login';
      this.http.post(link, formData)
      .map(res=>res.json())
      .subscribe(data => {
       console.log(data);
      // this.presentAlert("Issue added successfully");
      this.presentToast(data['message']);
       this.urlForm.reset();
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
  }
  presentAlert(subTitleMessage) {
    let alert = this.alertCtrl.create({
    subTitle: subTitleMessage,
    buttons: ['OK']
  });
  alert.present();
  }
}
