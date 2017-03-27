package matthewfrost.co.plantview

import android.content.Context
import android.hardware.Camera
import android.util.DisplayMetrics
import android.util.Log
import android.view.Surface
import android.view.SurfaceHolder
import android.view.WindowManager
import com.google.android.gms.vision.CameraSource
import com.google.android.gms.vision.barcode.BarcodeDetector

/**
 * Created by Matthew on 17/02/2017.
 */
class CameraSurface(surfaceHolder : SurfaceHolder, barcodeReader : BarcodeDetector, context : Context): SurfaceHolder.Callback
{
    public val holder : SurfaceHolder = surfaceHolder
    lateinit var camera : CameraSource
    val reader : BarcodeDetector = barcodeReader
    val c = context

    override fun surfaceChanged(holder: SurfaceHolder?, format: Int, width: Int, height: Int) {
        //throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun surfaceDestroyed(holder: SurfaceHolder?) {
        //throw UnsupportedOperationException("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun surfaceCreated(holder: SurfaceHolder?) {
       start_camera()
    }

    fun pause(){
        //camera.stopPreview()
        //camera.release()
    }

    private fun start_camera() {
//        camera = Camera.open()
//
//        val param : Camera.Parameters = camera.parameters
//        param.setRotation(180)
//        camera.parameters = param
//        try {
//            camera.setPreviewDisplay(holder)
//            camera.startPreview()
//        } catch (e: Exception) {
//            return
//        }
        camera = CameraSource.Builder(c, reader).setRequestedPreviewSize(1920, 1080).build()
        try{
            camera.start(holder)
        }
        catch(e : Exception){
            return
        }


    }
}