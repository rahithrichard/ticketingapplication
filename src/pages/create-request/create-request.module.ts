import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRequestPage } from './create-request';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    CreateRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRequestPage),
    IonicSelectableModule
    
  ],
})
export class CreateRequestPageModule {}
