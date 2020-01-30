import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MatCardModule} from '@angular/material/card';
import { ReportsPage } from '../reports/reports';
import { PendencyReportPage } from '../pendency-report/pendency-report';
/**
 * Generated class for the ReportcomponentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reportcomponent',
  templateUrl: 'reportcomponent.html',
})
export class ReportcomponentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportcomponentPage');
  }
  openPage(report){
  	console.log(report);
  	if(report==1)
      this.navCtrl.push('ReportsPage');
    else if(report==2)
      this.navCtrl.push('PendencyReportPage');
  	else
  	 this.navCtrl.push('IssueStageReportPage');
  }

}
