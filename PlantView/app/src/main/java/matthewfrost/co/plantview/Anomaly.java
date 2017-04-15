package matthewfrost.co.plantview;

import java.sql.Time;
import java.util.Date;

/**
 * Created by Matthew on 15/04/2017.
 */

public class Anomaly
{
    String Location;
    Long Value;
    Date Timestamp;
    Double Latitude;
    Double Longitude;

    public Anomaly(String L, Long V, Date T, Double lat, Double longitude){
        Location = L;
        Value = V;
        Timestamp = T;
        Latitude = lat;
        this.Longitude = longitude;
    }
}
