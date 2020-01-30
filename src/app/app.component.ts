import { Component,ViewChild,Inject } from '@angular/core';
import { Platform ,AlertController,Nav,ViewController,IonicApp} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { App } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@Component({
  templateUrl: 'app.html',
  
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
 // @Inject(ViewController) viewController:ViewController;
  rootPage:any = HomePage;

  constructor( public apps:IonicApp,platform: Platform,public app: App, statusBar: StatusBar, splashScreen: SplashScreen,public alertCtrl: AlertController,private locationAccuracy: LocationAccuracy) {
    platform.ready().then(() => {
      
      
     // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
   platform.registerBackButtonAction(() => {
      // Catches the active view
     let nav = this.app.getActiveNavs()[0];
      //let activeView = nav.getActive();                
      // Checks if can go back before show up the alert
      this.customHandleBackButton();
     /* try{
        this.viewController.dismiss();
    }
    catch{
      console.log("no view controller");
    }*/
          if (nav.canGoBack()){
              nav.pop();
          } else {
            const alert = this.alertCtrl.create({
              title: 'Note:',
              message: 'Back button is disabled here! If you want to exit then go to menu and please click Exit if you want to go background please click home button',
              buttons: [{
                  text: 'ok',
                  role: 'cancel',
              }],
              cssClass: 'alertCustomCss' 
         });
          alert.present();
          }
  });
  if (platform.is('cordova')) { platform.ready() .then(() =>{
    console.log('cordova Request successful');
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      console.log('cordova Request successful');
      
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error =>{
            platform.exitApp();
            console.log('Error requesting location permissions', error);
          }
        );
      
    });
   });}
  }
  customHandleBackButton() {
    const overlayView = this.apps._overlayPortal._views[0];
    if (overlayView && overlayView.dismiss) {
    overlayView.dismiss();
    }
  }
}

