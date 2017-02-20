package matthewfrost.co.plantview;

import android.content.Context;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONArray;

/**
 * Created by Matthew on 19/02/2017.
 */

public class VolleyRequest
{
    JSONArray result;

    public JsonArrayRequest callService(String url)
    {
        return new JsonArrayRequest
                (Request.Method.GET, url, null, new Response.Listener<JSONArray>() {

                    @Override
                    public void onResponse(JSONArray response) {
                        result = response;

                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        result = new JSONArray();
                    }
                });
    }
}
