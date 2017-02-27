package matthewfrost.co.plantview

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager

/**
 * Created by Matthew on 26/02/2017.
 */
class Compass : SensorEventListener
{
    var sensorManager : SensorManager
    var gsensor : Sensor
    var msensor : Sensor
    var mGravity : FloatArray = FloatArray(3)
    var mMagnetic : FloatArray = FloatArray(3)
    var azimuth : Double = 0.0


    constructor(c : Context){
        sensorManager = c.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        gsensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        msensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)
    }

    fun start(){
        sensorManager.registerListener(this, gsensor, SensorManager.SENSOR_DELAY_GAME)
        sensorManager.registerListener(this, msensor, SensorManager.SENSOR_DELAY_GAME)
    }

    fun stop(){
        sensorManager.unregisterListener(this)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        //throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onSensorChanged(event: SensorEvent) {
        var gravity : Float = 0.98f

        synchronized(this){
            if(event.sensor.type == Sensor.TYPE_ACCELEROMETER){
                mGravity[0] = gravity * mGravity[0] + (1 - gravity) * event.values[0]
                mGravity[1] = gravity * mGravity[1] + (1 - gravity) * event.values[1]
                mGravity[2] = gravity * mGravity[2] + (1 - gravity) * event.values[2] //Low pass filter
            }

            if(event.sensor.type == Sensor.TYPE_MAGNETIC_FIELD){
                mMagnetic[0] = gravity * mMagnetic[0] + (1 - gravity) * event.values[0]
                mMagnetic[1] = gravity * mMagnetic[1] + (1 - gravity) * event.values[1]
                mMagnetic[2] = gravity * mMagnetic[2] + (1 - gravity) * event.values[2]
            }

            var R : FloatArray = FloatArray(9)
            var I : FloatArray = FloatArray(9)

            var success = SensorManager.getRotationMatrix(R, I, mGravity, mMagnetic)

            if(success){
                var orientation : FloatArray = FloatArray(3)
                SensorManager.getOrientation(R, orientation)
                azimuth = Math.toDegrees(orientation[0].toDouble() + 45)
                azimuth = ((azimuth + 360) % 360)  //to account for device rotation

            }
        }
    }
}