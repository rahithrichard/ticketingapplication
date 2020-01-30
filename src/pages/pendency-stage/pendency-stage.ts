import { Component ,ViewChild,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MatTableDataSource,MatPaginator,MatSort} from '@angular/material';

/**
 * Generated class for the PendencyStagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pendency-stage',
  templateUrl: 'pendency-stage.html',
})
export class PendencyStagePage implements OnInit{
  displayedColumns = [ 'status','actual_time_taken_min','alloted_time_min','updated_on',];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any=[];
  pendencyData:any;
  ngAfterViewInit() {
    var id =JSON.parse(sessionStorage.getItem('clickedIssueNumber'));
    var allPendency=JSON.parse(sessionStorage.getItem('pandencyDetail'))['q_user_wise_pendency_list'];
    console.log(id,allPendency);
    for (let entry of allPendency){
      if(Object.keys(entry)[0]==id){
          console.log(entry[id]);
          this.pendencyData=entry[id]; 
            
      }
  }
  this.refreshData(this.pendencyData.sort((a,b)=>{
    if(a.updated_on>b.updated_on)
    return -1;
    else
    return 1;
  }));
    
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
  ngOnInit(){
       
  }
  queueName(){
    for(let i in this.pendencyData)
    {
      //console.log(this.pendencyData[i].queue);
      var a=this.pendencyData[i].queue;
      return a;
    }
  }
  issueNum(){
    //console.log(this.pendencyData);
    for(let i in this.pendencyData)
    {
      //console.log(this.pendencyData[i].issue_number);
      var a=this.pendencyData[i].issue_number;
      return a;
    }
    //return this.pendencyData[0].queue;
  }

  takeColor(row){
    console.log(row);
    if(row.alloted_time_min<row.actual_time_taken_min)
      return 'red';
  }
  refreshData(data:any[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
}
updateFormat(d){
  var toLocal=(new Date(d));
  toLocal=new Date(toLocal.setMinutes(toLocal.getMinutes()+330))
  var req=toLocal.toISOString().substr(0,10)+" "+toLocal.toISOString().slice(11,16);   
  return req;
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad PendencyStagePage');
  }
}
