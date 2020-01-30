import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IssueStageReportPage } from './issue-stage-report';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [
    IssueStageReportPage,
  ],
  imports: [
    IonicPageModule.forChild(IssueStageReportPage),
    MatTableModule,
    MatPaginatorModule
  ],
})
export class IssueStageReportPageModule {}
