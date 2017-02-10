var method = Tag.prototype;

function Tag(ID, Name, Value, Database, Table, Column, Lat, Long){
    this.ID = ID;
    this.Name = Name;
    this.ValueName = Value;
    this.Database = Database;
    this.Table = Table;
    this.Column = Column;
    this.Latitude = Lat;
    this.Longitude = Long;
}

method.getName = function(){
    return this.Name;
}

module.exports = Tag;