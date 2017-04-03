package matthewfrost.co.plantview

import android.app.*
import android.content.Context
import android.content.Intent
import android.location.Location
import com.google.android.gms.location.LocationListener
import android.os.Bundle
import android.os.IBinder
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.location.FusedLocationProviderApi
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationServices
import android.os.PowerManager
import android.os.Vibrator
import android.support.v7.app.NotificationCompat
import android.util.Log
import com.google.android.gms.common.GooglePlayServicesUtil


/**
 * Created by Matthew on 03/04/2017.
 */
class AnomalyService : Service, GoogleApiClient.OnConnectionFailedListener, GoogleApiClient.ConnectionCallbacks, LocationListener
{


    lateinit private var mGoogleApiClient: GoogleApiClient
    private var mWakeLock: PowerManager.WakeLock? = null
    lateinit var locationRequest: LocationRequest
    lateinit var locationAPI : FusedLocationProviderApi
    // Flag that indicates if a request is underway.
    private var mInProgress: Boolean = false

    lateinit var lastLocation : Location
    private var servicesAvailable: Boolean? = false

    constructor() : super()

    override fun onCreate() {
        super.onCreate()



    }

    /*
     * Create a new location client, using the enclosing class to
     * handle callbacks.
     */
    @Synchronized protected fun buildGoogleApiClient() {
        this.mGoogleApiClient = GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build()
    }


    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        locationRequest = LocationRequest.create()
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
        locationRequest.setInterval(120000)
        locationRequest.setFastestInterval(30000)
            buildGoogleApiClient()
        mGoogleApiClient.connect()
//        val mgr = getSystemService(Context.POWER_SERVICE) as PowerManager
//
//        /*
//        WakeLock is reference counted so we don't want to create multiple WakeLocks. So do a check before initializing and acquiring.
//        This will fix the "java.lang.Exception: WakeLock finalized while still held: MyWakeLock" error that you may find.
//        */
//        if (this.mWakeLock == null) { //**Added this
//            this.mWakeLock = mgr.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MyWakeLock")
//        }
//
//        if (!this.mWakeLock!!.isHeld) { //**Added this
//            this.mWakeLock!!.acquire()
//        }
//
//        if ((!servicesAvailable)!! || mGoogleApiClient!!.isConnected || mInProgress)
//            return Service.START_STICKY
//
//        setUpLocationClientIfNeeded()
//        if (!mGoogleApiClient!!.isConnected || !mGoogleApiClient!!.isConnecting && !mInProgress) {
//            mInProgress = true
//            mGoogleApiClient!!.connect()
//        }

        return Service.START_STICKY
    }


    private fun setUpLocationClientIfNeeded() {
        if (mGoogleApiClient == null)
            buildGoogleApiClient()
    }

    // Define the callback method that receives location updates
    override
    fun onLocationChanged(location: Location) {
        val mBuilder = NotificationCompat.Builder(this)
                .setSmallIcon(R.drawable.cast_ic_notification_small_icon)
                .setContentTitle("My notification")
                .setContentText("Hello World!")
        val resultIntent = Intent(this, MainActivity::class.java)

        val stackBuilder = TaskStackBuilder.create(this)
// Adds the back stack for the Intent (but not the Intent itself)
        stackBuilder.addParentStack(MainActivity::class.java)
// Adds the Intent that starts the Activity to the top of the stack
        stackBuilder.addNextIntent(resultIntent)
        val resultPendingIntent = stackBuilder.getPendingIntent(
                0,
                PendingIntent.FLAG_UPDATE_CURRENT
        )
        mBuilder.setContentIntent(resultPendingIntent)
        val mNotificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
// mId allows you to update the notification later on.
        mNotificationManager.notify(27, mBuilder.build())
    }

    override fun onBind(intent: Intent): IBinder? {
        TODO()
    }




    override fun onDestroy() {
        // Turn off the request flag
        this.mInProgress = false

        if (this.servicesAvailable!! && this.mGoogleApiClient != null) {
            this.mGoogleApiClient!!.unregisterConnectionCallbacks(this)
            this.mGoogleApiClient!!.unregisterConnectionFailedListener(this)
            this.mGoogleApiClient!!.disconnect()
            // Destroy the current location client
           // this.mGoogleApiClient = null
        }


        super.onDestroy()
    }
    override fun onConnected(bundle: Bundle?) {
        if(LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient) != null) {
            lastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient)
        }
        locationAPI.requestLocationUpdates(mGoogleApiClient, locationRequest,this)

    }
    override fun onConnectionFailed(connectionResult: ConnectionResult) {
        mInProgress = false

        /*
         * Google Play services can resolve some errors it detects.
         * If the error has a resolution, try sending an Intent to
         * start a Google Play services activity that can resolve
         * error.
         */
        if (connectionResult.hasResolution()) {

            // If no resolution is available, display an error dialog
        } else {

        }
    }

    override fun onConnectionSuspended(p0: Int) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

}