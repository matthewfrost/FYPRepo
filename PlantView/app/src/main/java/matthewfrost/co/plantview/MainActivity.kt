package matthewfrost.co.plantview

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.hardware.*
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.SurfaceHolder
import android.view.View
import android.widget.Toast
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.location.FusedLocationProviderApi
import com.google.android.gms.location.LocationListener
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.gson.Gson
import com.jjoe64.graphview.helper.DateAsXAxisLabelFormatter
import com.jjoe64.graphview.series.DataPoint
import com.jjoe64.graphview.series.LineGraphSeries
import com.ohmerhe.kolley.request.Http
import kotlinx.android.synthetic.main.activity_main.*
import java.nio.charset.Charset
import java.util.*
import android.database.sqlite.SQLiteDatabase
import java.text.SimpleDateFormat


class MainActivity : AppCompatActivity(), GoogleApiClient.OnConnectionFailedListener, GoogleApiClient.ConnectionCallbacks, LocationListener, SensorEventListener {

    lateinit var mSurfaceHolder: SurfaceHolder
    lateinit var mSensorManager: SensorManager
    lateinit var mGoogleApi: GoogleApiClient
    lateinit var lastLocation: android.location.Location
    lateinit var locationRequest : LocationRequest
    lateinit var locationAPI : FusedLocationProviderApi
    lateinit var compass : Compass
    lateinit var gsensor : Sensor
    lateinit var msensor : Sensor
    lateinit var sensorManager : SensorManager
    lateinit var cameraSurface : CameraSurface
    lateinit var helper : LocationDataDbHelper

    var North : MutableList<Location> =  arrayListOf()
    var East : MutableList<Location> = arrayListOf()
    var South : MutableList<Location> = arrayListOf()
    var West : MutableList<Location> = arrayListOf()
    var allLocations : MutableList<Location> = arrayListOf()
    var selectedArray : MutableList<Location> = arrayListOf()
    var locationData : MutableList<LocationData> = arrayListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)
        mSurfaceHolder = surfaceView.holder
        cameraSurface = CameraSurface(mSurfaceHolder)
        mSurfaceHolder.addCallback(cameraSurface)
        mSensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager

        compass = Compass(this)
        sensorManager = this.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        gsensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        msensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)

        top.setOnClickListener{
            showGridView()
        }

        helper = LocationDataDbHelper(applicationContext)
    }

    override fun onConnectionFailed(p0: ConnectionResult) {
        //throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onStart() {
        super.onStart()
        sensorManager.registerListener(this, gsensor, SensorManager.SENSOR_DELAY_GAME)
        sensorManager.registerListener(this, msensor, SensorManager.SENSOR_DELAY_GAME)
        compass.start()

    }

    override fun onPause(){
        super.onPause()
        sensorManager.unregisterListener(this)
        compass.stop()
        cameraSurface.pause()
        locationAPI.removeLocationUpdates(mGoogleApi, this)

    }

    override fun onResume(){
        super.onResume()
        sensorManager.registerListener(this, gsensor, SensorManager.SENSOR_DELAY_GAME)
        sensorManager.registerListener(this, msensor, SensorManager.SENSOR_DELAY_GAME)
        compass.start()
        mSurfaceHolder = surfaceView.holder
        var cameraSurface = CameraSurface(mSurfaceHolder)
        mSurfaceHolder.addCallback(cameraSurface)
        locationRequest = LocationRequest.create()
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
        locationRequest.setInterval(120000)
        locationRequest.setFastestInterval(30000)
        locationAPI = LocationServices.FusedLocationApi
        mGoogleApi = GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build()
        mGoogleApi.connect()
    }

    override fun onStop(){
        super.onStop()
        sensorManager.unregisterListener(this)
        compass.stop()
    }
    override fun onConnected(p0: Bundle?) {
        if(LocationServices.FusedLocationApi.getLastLocation(mGoogleApi) != null) {
            lastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApi)
            getLocations(lastLocation)
        }
        locationAPI.requestLocationUpdates(mGoogleApi, locationRequest,this)
    }

    override fun onConnectionSuspended(p0: Int) {
        throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onLocationChanged(p0: android.location.Location?) {
        getLocations(p0 as android.location.Location)
    }

    public fun getLocationData(ID : Int){
        var URL : String = "http://109.148.1.200:3001/getData?id=" + ID;

        Http.init(baseContext)
        Http.get{
            url = URL

            tag = this@MainActivity

            headers {
                "Content-Type" - "application/json"
                "Data-Type" - "application/json"
            }

            onSuccess {
                Response ->
                val gson: Gson = Gson()
                val JSONResponse = Response.toString(Charset.defaultCharset())
                locationData = arrayListOf()
                locationData = gson.fromJson(JSONResponse, Array<LocationData>::class.java).toMutableList()
                var series : LineGraphSeries<DataPoint> = LineGraphSeries()
                var index = 1
                var maxDifference : Long = 0
                var mean : Double = 0.0
                var total : Double = 0.0
                var temp : Double = 0.0
                var anomalies : MutableList<LocationData> = arrayListOf()

                val db = helper.getWritableDatabase()
                LocationDataContract.DataEntry.CURRENT_TABLE = locationData.get(0).Item
                graph.removeAllSeries()
                createGraph(locationData)
                /*for(data in locationData){
                    if(index < locationData.size) {
                        val contentValues : ContentValues = ContentValues()
                        contentValues.put(LocationDataContract.DataEntry.COLUMN_NAME_ITEM, locationData.get(index).Item)
                        contentValues.put(LocationDataContract.DataEntry.COLUMN_NAME_DATA, locationData.get(index).Data)
                        contentValues.put(LocationDataContract.DataEntry.COLUMN_NAME_TIMESTAMP, locationData.get(index).Data)
                        val newRow = db.insert(LocationDataDbHelper.DATABASE_NAME, null, contentValues)

                        var difference = locationData.get(index).Data - locationData.get(index - 1).Data
                        series.appendData(DataPoint(data.Timestamp, difference.toDouble()), true, 1000)
                        index++
                        if(difference > maxDifference){
                            maxDifference = difference
                        }
                        total += difference
                    }
                }
                mean = total / locationData.size
                index = 1
                for(data in locationData){
                    if(index < locationData.size) {
                        var x: Double = 0.0
                        x = (locationData.get(index).Data - locationData.get(index - 1).Data) - mean
                        temp += Math.pow(x, 2.0)
                        index++
                    }
                }
                index = 1
                //var y = ((1.0 / (locationData.size - 1)) * temp)
                var y = temp / locationData.size
                var stdDev = Math.pow(y, 0.5)
                for(data in locationData){
                    if(index < locationData.size){
                        var current = (locationData.get(index).Data - locationData.get(index - 1).Data)
                        if(current > (mean + (2 * stdDev)) || current < (mean - (2 * stdDev))){
                            anomalies.add(LocationData(locationData.get(index).Item, current, locationData.get(index).Timestamp))
                        }
                        index++
                    }
                }
                var adapter : LocationDataAdapter = LocationDataAdapter(baseContext, android.R.layout.simple_list_item_1, anomalies)
                listView.setAdapter(adapter)
                graph.viewport.setMaxY(100.0)
                graph.viewport.setYAxisBoundsManual(true)
                graph.gridLabelRenderer.setLabelFormatter(DateAsXAxisLabelFormatter(graph.context))

                graph.getViewport().setXAxisBoundsManual(true)
                graph.getGridLabelRenderer().setNumHorizontalLabels(4)
                graph.getViewport().setMinX(locationData.get(0).Timestamp.getTime().toDouble())
                graph.getViewport().setMaxX(locationData.get(0).Timestamp.getTime().toDouble() + (3*24*60*60*1000)  )
                graph.getViewport().setScrollable(true)

                graph.addSeries(series)
                progressBar2.setVisibility(View.GONE)
                graph.setVisibility(View.VISIBLE)*/


            }
            onFail {
                error ->
                val db = helper.getReadableDatabase()

                val projection = arrayOf<String>(LocationDataContract.DataEntry.COLUMN_NAME_DATA, LocationDataContract.DataEntry.COLUMN_NAME_ITEM, LocationDataContract.DataEntry.COLUMN_NAME_TIMESTAMP)
                graph.removeAllSeries()
                var cursor : Cursor = db.query(LocationDataContract.DataEntry.CURRENT_TABLE, projection, null, null, null, null, null)
                locationData = arrayListOf()
                val df = SimpleDateFormat("MM/dd/yyyy")
                while(cursor.moveToNext()){
                    val Item : String = cursor.getString(cursor.getColumnIndexOrThrow(LocationDataContract.DataEntry.COLUMN_NAME_ITEM))
                    val Data : Long = cursor.getLong(cursor.getColumnIndexOrThrow(LocationDataContract.DataEntry.COLUMN_NAME_DATA))
                    val tempTimestamp : String = cursor.getString(cursor.getColumnIndexOrThrow(LocationDataContract.DataEntry.COLUMN_NAME_TIMESTAMP))
                    val Timestamp = df.parse(tempTimestamp)
                    locationData.add(LocationData(Item, Data, Timestamp))
                }
                createGraph(locationData)
            }
        }
    }

    public fun createGraph(locationData : MutableList<LocationData>){
        var series : LineGraphSeries<DataPoint> = LineGraphSeries()
        var index = 1
        var maxDifference : Long = 0
        var mean : Double = 0.0
        var total : Double = 0.0
        var temp : Double = 0.0
        var anomalies : MutableList<LocationData> = arrayListOf()

        val db = helper.getWritableDatabase()
        LocationDataContract.DataEntry.CURRENT_TABLE = locationData.get(0).Item
        helper.createTable(db)
        for(data in locationData){
            if(index < locationData.size) {
                val contentValues : ContentValues = ContentValues()
                contentValues.put(LocationDataContract.DataEntry.COLUMN_NAME_ITEM, locationData.get(index).Item)
                contentValues.put(LocationDataContract.DataEntry.COLUMN_NAME_DATA, locationData.get(index).Data)
                contentValues.put(LocationDataContract.DataEntry.COLUMN_NAME_TIMESTAMP, locationData.get(index).Timestamp.toString())
                val newRow = db.insert(LocationDataContract.DataEntry.CURRENT_TABLE, null, contentValues)

                var difference = locationData.get(index).Data - locationData.get(index - 1).Data
                series.appendData(DataPoint(data.Timestamp, difference.toDouble()), true, 1000)
                index++
                if(difference > maxDifference){
                    maxDifference = difference
                }
                total += difference
            }
        }
        mean = total / locationData.size
        index = 1
        for(data in locationData){
            if(index < locationData.size) {
                var x: Double = 0.0
                x = (locationData.get(index).Data - locationData.get(index - 1).Data) - mean
                temp += Math.pow(x, 2.0)
                index++
            }
        }
        index = 1

        var y = temp / locationData.size
        var stdDev = Math.pow(y, 0.5)
        for(data in locationData){
            if(index < locationData.size){
                var current = (locationData.get(index).Data - locationData.get(index - 1).Data)
                if(current > (mean + (2 * stdDev)) || current < (mean - (2 * stdDev))){
                    anomalies.add(LocationData(locationData.get(index).Item, current, locationData.get(index).Timestamp))
                }
                index++
            }
        }
        var adapter : LocationDataAdapter = LocationDataAdapter(baseContext, android.R.layout.simple_list_item_1, anomalies)
        listView.setAdapter(adapter)
        graph.viewport.setMaxY(100.0)
        graph.viewport.setYAxisBoundsManual(true)
        graph.gridLabelRenderer.setLabelFormatter(DateAsXAxisLabelFormatter(graph.context))

        graph.getViewport().setXAxisBoundsManual(true)
        graph.getGridLabelRenderer().setNumHorizontalLabels(4)
        graph.getViewport().setMinX(locationData.get(0).Timestamp.getTime().toDouble())
        graph.getViewport().setMaxX(locationData.get(0).Timestamp.getTime().toDouble() + (3*24*60*60*1000)  ) //adding 3 days
        graph.getViewport().setScrollable(true)

        graph.addSeries(series)
        progressBar2.setVisibility(View.GONE)
        graph.setVisibility(View.VISIBLE)
    }

    public fun getLocations(location : android.location.Location){
        var URL : String = "http://109.148.1.200:3000/getByLocation?lat=" + location.latitude.toString() + "&long=" + location.longitude.toString()

        Http.init(baseContext)
        Http.get {
            url = URL

            tag = this@MainActivity

            headers {
                "Content-Type" - "application/json"
                "Data-Type" - "application/json"
            }

            onStart { Log.v("network", "start") }

            onSuccess {
                Response ->
                val gson: Gson = Gson()
                val JSONResponse = Response.toString(Charset.defaultCharset())
                clearArrays()
                allLocations = gson.fromJson(JSONResponse, Array<Location>::class.java).toMutableList()

                for(location in allLocations){
                    var diffLong = (location.Longitude - lastLocation.longitude)
                    var y = Math.sin(diffLong) * Math.cos(location.Latitude.toDouble())
                    var x = Math.cos(lastLocation.latitude)*Math.sin(location.Latitude.toDouble()) - Math.sin(lastLocation.latitude)*Math.cos(location.Latitude.toDouble())*Math.cos(diffLong)
                    var compass_bearing = Math.toDegrees(Math.atan2(y, x))
                    compass_bearing = (360 - ((compass_bearing + 360) % 360))

                    if(compass_bearing >= 315 || compass_bearing < 45){
                       North.add(location)
                    }
                    else if(compass_bearing >= 45 && compass_bearing < 135){
                        East.add(location)
                    }
                    else if(compass_bearing >= 135 && compass_bearing < 225){
                        South.add(location)
                    }
                    else {
                        West.add(location)
                    }
                }
                top.setText(North.size.toString())
                right.setText(East.size.toString())
                bottom.setText(South.size.toString())
                left.setText(West.size.toString())
            }

            onFail {
                error ->
                Toast.makeText(baseContext, error.toString(), Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        //throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onSensorChanged(event: SensorEvent) {
       var degree = compass.azimuth

        if(degree >= 315 || degree < 45){
            faceNorth()
        }
        else if(degree >= 45 && degree < 135){
            faceEast()
        }
        else if(degree >= 135 && degree < 225){
            faceSouth()
        }
        else {
            faceWest()
        }

    }

    fun clearArrays(){
        North = arrayListOf()
        East = arrayListOf()
        South = arrayListOf()
        West = arrayListOf()
    }

    fun showGridView(){
        top.setVisibility(View.GONE)
        right.setVisibility(View.GONE)
        bottom.setVisibility(View.GONE)
        left.setVisibility(View.GONE)
        gridView.setVisibility(View.VISIBLE)
        gridView.setAdapter(LocationAdapter(selectedArray, this))
    }

    public fun showCardView(ID: Int){
        gridView.setVisibility(View.GONE)
        cardView.setVisibility(View.VISIBLE)
        progressBar2.setVisibility(View.VISIBLE)
        getLocationData(ID)
    }

    fun hideGridView(){
        top.setVisibility(View.VISIBLE)
        right.setVisibility(View.VISIBLE)
        bottom.setVisibility(View.VISIBLE)
        left.setVisibility(View.VISIBLE)
        gridView.setVisibility(View.GONE)
    }

    fun hideCardView(){
        cardView.setVisibility(View.GONE)
        gridView.setVisibility(View.VISIBLE)
        graph.setVisibility(View.GONE)
    }

    override fun onBackPressed() {
        if(gridView.visibility == View.VISIBLE){
            hideGridView()
        }
        else if(cardView.visibility == View.VISIBLE){
            hideCardView()
        }
        else {
            super.onBackPressed()
        }
    }

    fun faceNorth(){
        top.setText(North.size.toString())
        right.setText(East.size.toString())
        bottom.setText(South.size.toString())
        left.setText(West.size.toString())
        selectedArray = North
    }

    fun faceEast(){
        top.setText(East.size.toString())
        right.setText(South.size.toString())
        bottom.setText(West.size.toString())
        left.setText(North.size.toString())
        selectedArray = East
    }

    fun faceSouth(){
        top.setText(South.size.toString())
        right.setText(West.size.toString())
        bottom.setText(North.size.toString())
        left.setText(East.size.toString())
        selectedArray = South
    }

    fun faceWest(){
        top.setText(West.size.toString())
        right.setText(North.size.toString())
        bottom.setText(East.size.toString())
        left.setText(South.size.toString())
        selectedArray = West
    }
}
