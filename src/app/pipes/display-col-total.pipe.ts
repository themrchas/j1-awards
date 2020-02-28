import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'displayColTotal'
})
export class DisplayColTotalPipe implements PipeTransform {

  transform(unit: any,awardBreakDown:Object): any {

    console.log('display-col-total: unit is', unit,' and awardBreakDown is', awardBreakDown);

    return _.reduce(awardBreakDown[unit],function(result,val) {

      console.log('display-col-total in reduce. result is',result,'and val is',val);
       return result + val;
},0); 
  }

}
