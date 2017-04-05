package matthewfrost.co.plantview

import android.app.Activity
import android.app.AlertDialog
import android.app.Dialog
import android.app.DialogFragment
import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Window
import android.widget.Toast
import java.util.zip.Inflater
import kotlinx.android.synthetic.main.resolution_dialog.submit


/**
 * Created by Matthew on 05/04/2017.
 */
class ResolutionDialog(c : Activity) : Dialog(c) {
    var activity : Activity = c


    override fun show() {
        super.show()
        this.setContentView(R.layout.resolution_dialog)


    }
}