var method = TagData.prototype;

function TagData(Item, Data,Timestamp){
    this.Item = Item;
    this.Data = Data;
    this.Timestamp = Timestamp;
}

module.exports = TagData;