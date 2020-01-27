import { Component, OnInit } from '@angular/core';
//import { DataService } from './../../services/data.service';
import { DataProviderService } from './../../services/data-provider.service';

import { Award } from './../../model/award';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  awards: Award[];
  //awards<Array<Award>> = null

  //testAwards: any = { name:"Beavis", occupation:"Slacker"};

  constructor(private dataProvider: DataProviderService) { }

  ngOnInit() {

    this.awards = this.dataProvider.awards;

  //  this.getAwardData();
  }

  /*private testObserver ={
    next: x => { console.log('Observer got a next value: ' + x); this.awards= x; },
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'), 
  } */


  /*private  getAwardData() {

    //let award: Award = new Award({AwardNumber:"HQ-001",DateAccepted:"1/2/2020"});
    //console.log(award.getData());



   // this.dataService._getData().subscribe(this.testObserver);
   this.dataService.getData().subscribe(this.testObserver);

  } */

}
