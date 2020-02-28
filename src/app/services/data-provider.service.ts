import { Injectable } from '@angular/core';

import { DataService } from './data.service';
import { ConfigProviderService } from './config-provider.service';

import { concat } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  awards: Array<any>;
  unitBreakDown: any;

 

  constructor(private dataService:DataService, private configProviderService:ConfigProviderService) { }

      load() {

            return new Promise((resolve, reject) => {

                  this.configProviderService.getConfiguration()
                        .subscribe(config => {


                              config.doLog && console.log('config-provider.service: config', config);


                              this.dataService.getInitialAwardData()

                                    .pipe(
                                          tap(val => console.log('data-provider.service: tapped data from dataService.getInitialAwardData is', val)),
                                          concatMap(data => this.dataService.analyzeAwardData()))
                                    .subscribe(final => {
                                          console.log('******conacat map provided', final);
                                          resolve(true)
                                    });

                        })



                  /* Works w/o config.txt
                        this.dataService.getInitialAwardData()
                         
                         .pipe(
                            tap(val => console.log('tapped data is',val) ),
                           concatMap(data => this.dataService.analyzeAwardData() ))
                            .subscribe(final => { 
                                  console.log('******conacat map provided',final);
                                  resolve(true) 
                            });
                        */

            })




} //load




}
