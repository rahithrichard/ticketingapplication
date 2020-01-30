import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CreateRequestPage } from '../create-request/create-request';
import { QueueListPage } from '../queue-list/queue-list';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the QueueMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-queue-menu',
  templateUrl: 'queue-menu.html',
})
export class QueueMenuPage {

  @ViewChild(Nav) nav: Nav;   

  rootPage: any = QueueListPage;

  pages: Array<{title: string, component: any,icon:string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Workflows', component: QueueListPage,icon:'git-network' },
      { title: 'Categories', component: CreateRequestPage,icon:'grid' },
      { title: 'Departments', component: ProfilePage,icon:'git-branch' },
      { title: 'Groups', component: ProfilePage,icon:'contacts' },
      { title: 'Users', component: ProfilePage,icon:'contact' },
      { title: 'Request Queues', component: ProfilePage,icon:'git-pull-request' },
      { title: 'Settings', component: ProfilePage,icon:'hammer' }    
    ];
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
}
