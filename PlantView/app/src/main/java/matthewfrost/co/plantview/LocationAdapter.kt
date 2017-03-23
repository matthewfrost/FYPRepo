package matthewfrost.co.plantview

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.Button

/**
 * Created by Matthew on 05/03/2017.
 */
class LocationAdapter( array : MutableList<Location>, activity : MainActivity): BaseAdapter()
{
    var main = activity
    var context : Context = activity.applicationContext
    var array : MutableList<Location> = array

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        var button : Button;
        button = Button(context)
        button.setText(array.get(position).Name)
        var scale = context.resources.displayMetrics.density
        var height = (50f * scale * 0.5f).toInt()
        var width = (100f * scale * 0.5f).toInt()
        button.setHeight(height)
        button.setWidth(width)
        button.setBackgroundResource(R.drawable.bluecard)
        button.setOnClickListener {
            var ID = array.get(position).ID
            var Name = array.get(position).ValueName
            main.showCardView(ID, Name)
        }
        return button
    }

    override fun getItem(position: Int): Any {
        return array.get(position)
    }

    override fun getItemId(position: Int): Long {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun getCount(): Int {
        return array.count()
    }
}