import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsPage } from './reports';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    ReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsPage),
    MatExpansionModule
  ],
})
export class ReportsPageModule {}
