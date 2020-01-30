import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GpsLogPage } from './gps-log';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    GpsLogPage,
  ],
  imports: [
    IonicPageModule.forChild(GpsLogPage),
    MatPaginatorModule,
    MatTableModule,AgmCoreModule.forRoot({
      apiKey:'AIzaSyAhSOhPY8yg3-jNSvfnnOfi0N-4SrulHG0'
    }),
  ],
})
export class GpsLogPageModule {}
