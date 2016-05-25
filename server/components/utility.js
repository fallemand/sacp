/**
 * Created by falle on 25/05/2016.
 */

'use strict';

export function processQuery(query) {
    if(query) {
        var result = {};
        for(var attribute in query){
            var regexp = new RegExp(query[attribute], "i");
            result[attribute] = regexp;
        }
        return result;
    }
}
