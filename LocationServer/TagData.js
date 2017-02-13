var method = TagData.prototype;

function TagData(ID, Name, Value, Timestamp){
    this.ID = ID;
    this.Name = Name;
    this.Value = Value;
    this.Timestamp = Timestamp;
}

module.exports = TagData;