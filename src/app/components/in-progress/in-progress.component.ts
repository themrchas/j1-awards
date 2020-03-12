import { Component, OnInit } from '@angular/core';

import { DataService } from './../../services/data.service';

import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss']
})
export class InProgressComponent implements OnInit {

 

  //Categories of awards to be displayed in the table
 inProgressTypes: Array<string>;

 //Descriptions of categories displayed in the table 
 inProgressTypeDescriptions: Object;

 awardsInProcessing: Object;

 questionMarkIcon: string = "\uf059";

 closeResult: string;

  constructor(private dataService:DataService,private modalService: NgbModal ) { }

  
  ngOnInit() {

    this.inProgressTypes = this.dataService.inProgressTypes
    this.inProgressTypeDescriptions = this.dataService.inProgressDescriptions;
    this.awardsInProcessing = this.dataService.awardsInProcessing;
  }

 

open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'xl'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });


}


private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
