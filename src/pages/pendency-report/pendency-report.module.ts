import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendencyReportPage } from './pendency-report';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
//import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [
    PendencyReportPage,
  ],
  imports: [
    IonicPageModule.forChild(PendencyReportPage),
    AngularDateTimePickerModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class PendencyReportPageModule {}
