package matthewfrost.co.plantview;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Created by Matthew on 20/03/2017.
 */

public class LocationDataDbHelper extends SQLiteOpenHelper
{
    public static final int DATABASE_VERSION = 1;
    public static final String DATABASE_NAME = "LocationData.db";

    private static final String SQL_CREATE_ENTRIES =
            "CREATE TABLE " + LocationDataContract.DataEntry.TABLE_NAME + " (" +
                    LocationDataContract.DataEntry._ID + " INTEGER PRIMARY KEY," +
                    LocationDataContract.DataEntry.COLUMN_NAME_ITEM + " TEXT," +
                    LocationDataContract.DataEntry.COLUMN_NAME_DATA + " REAL," +
                    LocationDataContract.DataEntry.COLUMN_NAME_TIMESTAMP + " TEXT)";

    private static final String SQL_DELETE_ENTRIES =
            "DROP TABLE IF EXISTS " + LocationDataContract.DataEntry.CURRENT_TABLE;

    public LocationDataDbHelper(Context c){
        super(c, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(SQL_CREATE_ENTRIES);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // This database is only a cache for online data, so its upgrade policy is
        // to simply to discard the data and start over
        db.execSQL(SQL_DELETE_ENTRIES);
        onCreate(db);
    }

    public void onDowngrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        onUpgrade(db, oldVersion, newVersion);
    }
}
