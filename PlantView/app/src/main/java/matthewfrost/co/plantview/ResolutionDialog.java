package matthewfrost.co.plantview;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;

/**
 * Created by Matthew on 07/04/2017.
 */

public class ResolutionDialog extends Dialog implements View.OnClickListener
{
    Context c;
    LocationData item;

    public ResolutionDialog(Activity a, LocationData data){
        super(a);
        c = a;
        item = data;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.resolution_dialog);
        Button submit = (Button) findViewById(R.id.submit);
        Button cancel = (Button) findViewById(R.id.cancel);
        EditText resolution = (EditText) findViewById(R.id.Resolution);
        cancel.setOnClickListener(this);
        submit.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.cancel:
                this.dismiss();
                break;
        }
    }
}
