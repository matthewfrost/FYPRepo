package matthewfrost.co.plantview;
import java.util.Date;
import java.util.TooManyListenersException;

/**
 * Created by Matthew on 07/03/2017.
 */

public class LocationData {
    public String Item;
    public Long Data;
    public Date Timestamp;

    public LocationData(String item, Long data, Date timestamp){
        Item = item;
        Data = data;
        Timestamp = timestamp;
    }
}
