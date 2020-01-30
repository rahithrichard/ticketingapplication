import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IssueListPage } from './issue-list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    IssueListPage,
  ],
  imports: [
    IonicPageModule.forChild(IssueListPage),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule
  ]
})
export class IssueListPageModule {}
