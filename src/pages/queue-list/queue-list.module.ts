import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QueueListPage } from './queue-list';

@NgModule({
  declarations: [
    QueueListPage,
  ],
  imports: [
    IonicPageModule.forChild(QueueListPage),
  ],
})
export class QueueListPageModule {}
