package matthewfrost.co.plantview

import android.content.Context
import android.widget.ArrayAdapter
import java.util.*

/**
 * Created by Matthew on 15/03/2017.
 */
class LocationDataAdapter : ArrayAdapter<LocationData>
{
    var Data : HashMap<String, Int> = HashMap()

    constructor(c : Context, resourceViewId : Int, data :  MutableList<LocationData>) : super(c, resourceViewId, data){
        var index = 0
        for(locationData in data){
            Data.put(locationData.toString(), index)
            index++
        }
    }


}