template
 <span slot="right" type="text" ref="menuItem"  @click.stop="show2 = true" readonly class="cell-input" >{{model2}}</span>
 <cityselect
        v-model="show2"
        :done="result2"
        provance=""
        city=""
        area=""
></cityselect>
#----

 import {CitySelect} from '../../modules/cityselect';

#----
methods:

result2(ret) {
    this.model2 = ret.provance.name + ' ' + ret.city.name + ' ' + ret.area.name + ' '+ ret.region.name;
    var ids = ret.provance.id + ' ' + ret.city.id + ' ' + ret.area.id + ' '+ ret.region.id;
},