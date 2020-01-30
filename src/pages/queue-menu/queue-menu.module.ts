import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QueueMenuPage } from './queue-menu';

@NgModule({
  declarations: [
    QueueMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(QueueMenuPage),
  ],
})
export class QueueMenuPageModule {
  
}
