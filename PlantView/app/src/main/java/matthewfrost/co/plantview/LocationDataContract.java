package matthewfrost.co.plantview;

import android.provider.BaseColumns;

/**
 * Created by Matthew on 20/03/2017.
 */

public final class LocationDataContract {

    private LocationDataContract(){}

    public static class DataEntry implements BaseColumns{
        public static String TABLE_NAME = "LocationData";
        public static final String COLUMN_NAME_ITEM = "item";
        public static final String COLUMN_NAME_DATA = "data";
        public static final String COLUMN_NAME_TIMESTAMP = "timestamp";
        public static String CURRENT_TABLE = "";
    }
}
