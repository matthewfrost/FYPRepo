package matthewfrost.co.plantview

/**
 * Created by Matthew on 14/02/2017.
 */
class Location (name: String, Lat : Float, Long : Float, Val : String){
    public val Name : String = name
    public val Latitude : Float = Lat
    public val Longitude : Float = Long
    public val Value : String = Val
    public var Data : List<Float> = listOf()
}