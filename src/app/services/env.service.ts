import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

 // The values that are defined here are the default values that can
  // be overridden by env.js

  // List web
  public listWeb = 'http://localhost:8080/sites/dev/socafdev/';

  //Doc library containg config file.  This document is by default where build exists
  public docLib = "AwardsApp";

  //Config file name
  public configFile = "config.txt";

  //Complete path to config file
  public configPath =  this.listWeb + this.docLib + "/" + this.configFile;

  
  constructor() {
  }

}
