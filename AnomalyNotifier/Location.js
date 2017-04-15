var method = Location.prototype;

function Location(Name, ValueName, Data, Timestamp, lat, long) {
    this.Name = Name;
    this.ValueName = ValueName;
    this.Data = Data;
    this.Timestamp = Timestamp;
    this.Latitude = lat;
    this.Longitude = long;
}

module.exports = Location;