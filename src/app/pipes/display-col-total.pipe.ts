import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'displayColTotal'
})
export class DisplayColTotalPipe implements PipeTransform {

  transform(unit: any,awardBreakDown:Object): any {
    return _.reduce(awardBreakDown[unit],function(result,val) {
       return result + val;
},0); 
  }

}
