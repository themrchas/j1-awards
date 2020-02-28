import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'displayRowTotal'
})
export class DisplayRowTotalPipe implements PipeTransform {

  transform(award: string, awardBreakDown: Object): any {

    console.log('display-row-total: award is', award,' and awardBreakDown is', awardBreakDown);
   
    return _.reduce(awardBreakDown ,function(result,val) {

      console.log('display-row-total in reduce. result is',result,'and val is',val);
      return result + val[award];
    },0); 

  }

}
