import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform ,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CreateRequestPage } from '../create-request/create-request';
import { IssueListPage } from '../issue-list/issue-list';
import { ProfilePage } from '../profile/profile';
import { DashboardPage} from '../dashboard/dashboard';
import {GpsLogPage} from '../gps-log/gps-log';
import { HomePage } from '../home/home';
import { LocationTrackerProvider} from '../../providers/location-tracker/location-tracker';
import{ReportcomponentPage} from '../reportcomponent/reportcomponent';
import { FormControl, FormGroup, Validators,ValidatorFn,AbstractControl,FormBuilder} from '@angular/forms';
import { Http, Headers, Response, URLSearchParams , RequestOptions} from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
@ViewChild(Nav) nav: Nav;
  authForm: FormGroup;
  isBrowser:boolean=false;
  rootPage: any = DashboardPage;
  hideMenu = false;
  contact:any;
  user:any;
  userEmail:any;
  display='none';
  selectedmenu:any;
  passwordPattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{7,}";
  //passwordPattern = "(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$";
  pages: Array<{title: string, component: any,icon:string}>;

  constructor(public locationTracker:LocationTrackerProvider,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public _app:App,public formBuilder: FormBuilder,public http: Http,private alertCtrl: AlertController) {;
    this.initializeApp();
    this.getContact();
    if(this.platform.is('core') || this.platform.is('mobileweb')){
      this.isBrowser = true;
    }
    if(localStorage.getItem('userData')){
        this.user = JSON.parse(localStorage.getItem('userData'));
        console.log(this.user.id);
        this.userEmail=this.user.email;
        if(!this.isBrowser){
           this.locationTracker.stopTracking();
           this.locationTracker.startBackgroundGeo();
           }
      }
      /*if(localStorage.getItem('rootPage'))
        this.rootPage=JSON.parse(localStorage.getItem('rootPage'));*/
        //console.log(this.rootPage);
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: 'DashboardPage',icon:'md-analytics' },
      { title: 'Issue List', component: 'IssueListPage',icon:'list-box' },
      { title: 'Create Request', component: 'CreateRequestPage',icon:'add' },
      { title: 'Profile',component:'ProfilePage',icon:'person'},
      { title: 'Reports',component:'ReportcomponentPage',icon:'clipboard'},
      {title:'Gps Log',component:'GpsLogPage',icon:'locate'}
    ];
    this.authForm = formBuilder.group({
      cur_password:['',[Validators.required]],
      new_password: ['',[Validators.required, Validators.pattern(this.passwordPattern)]],
      con_password: ['',[Validators.required, this.equalto('new_password')]]
    });      
  }
  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let input = control.value;
        let isValid = control.root.value[field_name] == input;
        if (!isValid)
            return {'equalTo': {isValid}};
        else
            return null;
    };
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    if(!localStorage.getItem('userData')) {
    this._app.getRootNav().setRoot(HomePage);
    }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  close(){
    this.display='none'; 
  }
  onSubmitPassword(){
    var link = '/admin/api/v1.0/users/'+this.user.id+'/change_password';
    console.log(link);
    let formData=new FormData();
    formData.append('password1',this.authForm.value.cur_password);
    formData.append('password2',this.authForm.value.new_password);

        //var data = JSON.stringify();
        this.http.post(link, formData)
        .subscribe(data => {
         console.log(data);
         this.presentAlert("Password changed successfully");
         this.authForm.reset();
         //this.nav.push('IssueListPage');
        }, error => {
         this.presentAlert(JSON.parse(error).message);
         console.log("Oooops!"+error);
        });
        this.display='none'; 
  }
  getContact(){
    //localStorage.setItem('url',JSON.stringify(this.apiUrl));          
    //localStorage.setItem('url',JSON.stringify('http://demo1.yukthi.biz:8083'));
  var  link = '/rt/api/v1.0/click_to_call ';
  //console.log(link);
      this.http.get(link)
  .map(res => res.json())
  .subscribe(data =>{
    console.log(data);
    this.contact=data.call_link;
    console.log(this.contact);
  },  error => {
      console.log("Oooops!"+error);
  }); 
  }
  exitApp(){
    let a=this.promptAlert();
    console.log(a);
    a.present();
    a.onDidDismiss((data) => {
     console.log('Yes/No', data);
     if(data==false){
       //this.logout();
    this.locationTracker.stopTracking();
    this.platform.exitApp();
     }
  });
 }
 promptAlert()
{
    let alert = this.alertCtrl.create({
        title: 'Warning:',
        subTitle: '<br>If you will exit gps tracking will stop ! ',
        message:'<p>Are you sure want to exit?</p>',
       buttons: [
            {
                text: 'No',
                handler: () => {
                    alert.dismiss(true);
                    return false;
                }
            }, {
                text: 'Yes',
                handler: () => {
                    alert.dismiss(false);
                    return false;
                }
            }
        ],
        cssClass: 'alertCustomCss' 
    });

    return alert;
}
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.selectedmenu=page.title;
    console.log(page);
    //localStorage.setItem('rootPage',JSON.stringify(page.component.name));
    this.nav.setRoot(page.component);
  }
  openModal(){
		this.display='block'; 
  }

  presentAlert(subTitleMessage) {
    let alert = this.alertCtrl.create({
      subTitle: subTitleMessage,
      buttons: ['OK']
    });
    alert.present();
    }
  
  logout(){
    console.log("logout");
    var a=[];
    var usr=JSON.parse(localStorage.getItem("userValue"));
    a = JSON.parse(localStorage.getItem("saved"));
    if(a==null){
    if(localStorage.getItem('userData')) {
        localStorage.clear();
    }
    if(sessionStorage.getItem('clickedIssue') || sessionStorage.getItem('clickedIssueNumber')) {
        sessionStorage.clear();
    }
    localStorage.setItem("userValue", JSON.stringify(usr));
    this._app.getRootNav().setRoot(HomePage);
    this.locationTracker.stopTracking();
  }
  else{
    this.locationTracker.postGPS();
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle:'1.Make sure your internet connection is working.<br>2.Make sure in Gps Log page all the gps data is sent then try again.',
      message: 'If none of the above problem occurs then may be there is server error please try again in a moment',
      buttons: [{
          text: 'ok',
          role: 'cancel',
      }],
      cssClass: 'alertCustomCss' 
 });
  alert.present();
  }
  }
  //all the gps data is sent if some data is not sent then first send that data by clicking button <b>"send not sent data"</b> then
}
