import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportcomponentPage } from './reportcomponent';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    ReportcomponentPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportcomponentPage),
    MatCardModule
  ],
})
export class ReportcomponentPageModule {}
