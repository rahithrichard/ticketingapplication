import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditIssuePage } from './edit-issue';
import {AngularDateTimePickerModule} from 'angular2-datetimepicker';
import { IonicSelectableModule } from 'ionic-selectable';
import { ClickOutsideModule } from 'ng-click-outside';
@NgModule({
  declarations: [
    EditIssuePage,
  ],
  imports: [
    IonicPageModule.forChild(EditIssuePage),
    AngularDateTimePickerModule,
    ClickOutsideModule,
    IonicSelectableModule
  ],
})
export class EditIssuePageModule {}