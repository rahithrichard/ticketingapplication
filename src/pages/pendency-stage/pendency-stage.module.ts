import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendencyStagePage } from './pendency-stage';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [
    PendencyStagePage,
  ],
  imports: [
    IonicPageModule.forChild(PendencyStagePage),
    MatTableModule,
    MatPaginatorModule
  ],
})
export class PendencyStagePageModule {}
