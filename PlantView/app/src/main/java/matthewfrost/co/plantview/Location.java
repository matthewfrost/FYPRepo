package matthewfrost.co.plantview;

/**
 * Created by Matthew on 21/02/2017.
 */

public class Location
{
    public int ID;
    public String Database;
    public String Table;
    public String Column;
    public String Name;
    public Float Latitude;
    public Float Longitude;
    public String ValueName;

    public Location(int id, String db, String table, String column, String name, Float lat, Float longitude, String VName ){
        ID = id;
        Database = db;
        Table = table;
        Column = column;
        Name = name;
        Latitude = lat;
        Longitude = longitude;
        ValueName = VName;
    }
}
