import { Injectable } from '@angular/core';



import { SpService } from "./sp.service";

import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigProviderService {

  private _config;

  constructor(private spService: SpService) { }

  getConfiguration(): Observable<any> {
      //return this.spService.getConfig(configFile);

      return this.spService.getConfig()
        .pipe(val =>  this._config = val);

  }

  get config() {
    return this._config;
  }

  



  


}
