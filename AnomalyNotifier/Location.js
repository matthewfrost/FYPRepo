var method = Location.prototype;

function Location(Name, ValueName, Data, Timestamp) {
    this.Name = Name;
    this.ValueName = ValueName;
    this.Data = Data;
    this.Timestamp = Timestamp;
}

module.exports = Location;