import { Component, OnInit } from '@angular/core';

import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss']
})
export class InProgressComponent implements OnInit {

 inProgressTypes: Array<string>;
 awardsInProcessing: Object;


  constructor(private dataService:DataService) { }

  ngOnInit() {

    this.inProgressTypes = this.dataService.inProgressTypes
    this.awardsInProcessing = this.dataService.awardsInProcessing;
  }

}
