import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UseUrlPage } from './use-url';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    UseUrlPage,
  ],
  imports: [
    IonicPageModule.forChild(UseUrlPage),
    IonicSelectableModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UseUrlPageModule {}
