package matthewfrost.co.plantview

import android.content.Context
import android.hardware.Camera
import android.hardware.SensorManager
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.DisplayMetrics
import android.util.Log
import android.view.SurfaceHolder
import android.view.WindowManager
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.VolleyError
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.location.LocationServices
import kotlinx.android.synthetic.main.activity_main.*
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : AppCompatActivity(), GoogleApiClient.OnConnectionFailedListener, GoogleApiClient.ConnectionCallbacks {

    lateinit var mSurfaceHolder: SurfaceHolder
    lateinit var mSensorManager: SensorManager
    lateinit var mGoogleApi: GoogleApiClient
    lateinit var lastLocation: android.location.Location

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)
        mSurfaceHolder = surfaceView.holder
        var cameraSurface = CameraSurface(mSurfaceHolder)
        mSurfaceHolder.addCallback(cameraSurface)
        mSensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        mGoogleApi = GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build()
        mGoogleApi.connect()
    }

    override fun onConnectionFailed(p0: ConnectionResult) {
        throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onConnected(p0: Bundle?) {
        var url = "https://httpbin.org/get"
        var queue = Volley.newRequestQueue(this)
        queue.add(JsonObjectRequest(Request.Method.GET, url, null,
                Response.Listener<JSONObject>() {
                    @Override
                    fun onResponse(response: JSONObject) {
                        // mTxtDisplay.setText("Response: " + response.toString());
                        Log.v("network", response.toString())
                    }
                },
                Response.ErrorListener() {
                    @Override
                    fun onErrorResponse(error: VolleyError) {
                        Log.v("network", error.toString())
                    }
        }))

    }

    override fun onConnectionSuspended(p0: Int) {
        throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}
