package matthewfrost.co.plantview

import android.content.Context
import android.hardware.*
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.os.Looper
import android.util.DisplayMetrics
import android.util.Log
import android.view.SurfaceHolder
import android.view.WindowManager
import android.widget.Toast
import com.android.volley.*
import com.android.volley.toolbox.*
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.location.FusedLocationProviderApi
import com.google.android.gms.location.LocationListener
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import com.google.gson.Gson
import com.ohmerhe.kolley.request.Http
import kotlinx.android.synthetic.main.activity_main.*
import org.json.JSONArray
import org.json.JSONObject
import java.nio.charset.Charset
import kotlin.jvm.javaClass

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
    var North : MutableList<Location> =  arrayListOf()
    var East : MutableList<Location> = arrayListOf()
    var South : MutableList<Location> = arrayListOf()
    var West : MutableList<Location> = arrayListOf()
    var allLocations : MutableList<Location> = arrayListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)
        mSurfaceHolder = surfaceView.holder
        var cameraSurface = CameraSurface(mSurfaceHolder)
        mSurfaceHolder.addCallback(cameraSurface)
        mSensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
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
        compass = Compass(this)
        sensorManager = this.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        gsensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        msensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)
    }

    override fun onConnectionFailed(p0: ConnectionResult) {
        throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
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
    }

    override fun onResume(){
        super.onResume()
        sensorManager.registerListener(this, gsensor, SensorManager.SENSOR_DELAY_GAME)
        sensorManager.registerListener(this, msensor, SensorManager.SENSOR_DELAY_GAME)
        compass.start()
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

    public fun getLocations(location : android.location.Location){
        var URL : String = "http://109.148.191.85:3000/getByLocation?lat=" + location.latitude.toString() + "&long=" + location.longitude.toString()

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
                    var diffLong = Math.toRadians(location.Longitude - lastLocation.longitude)
                    var lat1 = Math.toRadians(lastLocation.latitude)
                    var lat2 = Math.toRadians(location.Latitude.toDouble())
                    var x = Math.sin(diffLong) * Math.cos(lat2)
                    var y = Math.cos(lat1) * Math.sin(lat2) - (Math.sin(lat1) * Math.sin(lat2) * Math.cos(diffLong))
                    var init_bearing = Math.atan2(x, y)
                    init_bearing = Math.toDegrees(init_bearing)
                    var compass_bearing = (init_bearing + 360) % 360

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
        Log.v("degree", compass.azimuth.toString())
        //move ui elements around screen
    }

    fun clearArrays(){
        North = arrayListOf()
        East = arrayListOf()
        South = arrayListOf()
        West = arrayListOf()
    }
}
