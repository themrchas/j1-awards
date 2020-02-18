import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'displayRowTotal'
})
export class DisplayRowTotalPipe implements PipeTransform {

  transform(award: string, awardBreakDown: Object): any {
   
    return _.reduce(awardBreakDown ,function(result,val) {
      return result + val[award];
    },0); 

  }

}
