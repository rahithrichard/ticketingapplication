import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CreateRequestPage } from '../pages/create-request/create-request';
import { IssueListPage } from '../pages/issue-list/issue-list';
import { customHttpProvider } from '../providers/remote-service/remote-service';
import { UpdateRequestPage } from '../pages/update-request/update-request';
import { MenuPageModule } from '../pages/menu/menu.module';
import { UseUrlPageModule } from '../pages/use-url/use-url.module';
import { HttpClientModule } from '@angular/common/http'; 

import { IssueListPageModule } from '../pages/issue-list/issue-list.module'
import { CreateRequestPageModule } from '../pages/create-request/create-request.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { EditIssuePage } from '../pages/edit-issue/edit-issue';
import {QueueListPageModule} from '../pages/queue-list/queue-list.module';
import {DashboardPageModule} from '../pages/dashboard/dashboard.module';
import {ReportsPageModule} from '../pages/reports/reports.module';
import {GpsLogPageModule} from '../pages/gps-log/gps-log.module';
import {PendencyStagePageModule} from '../pages/pendency-stage/pendency-stage.module'
import {PendencyReportPageModule} from '../pages/pendency-report/pendency-report.module';
import {IssueStageReportPageModule} from '../pages/issue-stage-report/issue-stage-report.module';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule,MatSnackBarModule} from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {MatTableDataSource} from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {MatExpansionModule} from '@angular/material/expansion';
import{ReportcomponentPageModule} from '../pages/reportcomponent/reportcomponent.module';
import {MatCardModule} from '@angular/material/card';
import { Geolocation } from '@ionic-native/geolocation';
import { GpsProvider } from '../providers/gps/gps';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation} from '@ionic-native/background-geolocation';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import {  FileTransfer,  FileTransferObject  } from '@ionic-native/file-transfer';  
import {  File } from '@ionic-native/file'; 
import { AndroidPermissions } from '@ionic-native/android-permissions';
//import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicSelectableModule,
    HttpModule,
    HttpClientModule,
    MatSnackBarModule,
    IonicModule.forRoot(MyApp),
    MenuPageModule,
    IssueListPageModule,
    CreateRequestPageModule,
    GpsLogPageModule,
    PendencyStagePageModule,
    UseUrlPageModule ,
    QueueListPageModule,
    DashboardPageModule,
    ProfilePageModule,
    ReportsPageModule,
    PendencyReportPageModule,
    IssueStageReportPageModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    ReportcomponentPageModule,
    MatCardModule,
    AngularDateTimePickerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,

  ],
  providers: [
    LocationAccuracy,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    customHttpProvider,
    Geolocation,
    GpsProvider,
    BackgroundMode,
    BackgroundGeolocation,
    FileTransfer, 
    FileTransferObject ,
    File,
    AndroidPermissions,
    LocationTrackerProvider
  ]
})
export class AppModule {}

