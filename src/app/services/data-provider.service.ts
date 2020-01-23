import { Injectable } from '@angular/core';

import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  awards: Array<any>;
  unitBreakDown: any;

  constructor(private dataService:DataService) { }

  load() {
    return new Promise((resolve, reject) => {
        this.dataService
            .getData()
            .subscribe(response => {
                console.log("********data-provider.service returned", response);
                this.awards = response;

                //Grab the data that has been broken down per unit
                this.unitBreakDown = this.dataService.getAwardBreakdown();
                console.log('*******data-provide.service: unitBreakDown is ',this.unitBreakDown);
                resolve(true);
            })
    })
}
}
