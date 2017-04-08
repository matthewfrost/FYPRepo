package matthewfrost.co.plantview;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.analytics.HitBuilders;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

/**
 * Created by Matthew on 07/04/2017.
 */

public class ResolutionDialog extends Dialog implements View.OnClickListener
{
    Context c;
    LocationData item;
    int locationID;
    EditText resolution;

    public ResolutionDialog(Activity a, LocationData data, int locationID){
        super(a);
        c = a;
        item = data;
        this.locationID = locationID;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.resolution_dialog);
        Button submit = (Button) findViewById(R.id.submit);
        Button cancel = (Button) findViewById(R.id.cancel);
        resolution = (EditText) findViewById(R.id.Resolution);
        cancel.setOnClickListener(this);
        submit.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.cancel:
                this.dismiss();
                break;
            case R.id.submit:
                try {
                    RequestQueue queue = Volley.newRequestQueue(c);
                    String url = "http://109.147.44.68:3002/submitResolution";
                    JSONObject body = new JSONObject();
                    body.put("LocationID", locationID);
                    body.put("Value", item.Data);
                    body.put("Resolution", resolution.getText().toString());
                    final String requestBody = body.toString();

                    StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Log.v("response", response);
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.e("error", error.toString());
                        }
                    }){
                        @Override
                        public String getBodyContentType() {
                            return "application/json; charset=utf-8";
                        }

                        @Override
                        public byte[] getBody() throws AuthFailureError {
                            try {
                                return requestBody == null ? null : requestBody.getBytes("utf-8");
                            } catch (UnsupportedEncodingException uee) {
                                VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
                                return null;
                            }
                        }
                    };

                    queue.add(request);
                }
                catch(Exception e){

                }

        }
    }
}
