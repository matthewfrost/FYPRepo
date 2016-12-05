var method = Tag.prototype;

function Tag(ID, Name, TagName, Lat, Long){
    this.ID = ID;
    this.Name = Name;
    this.TagName = TagName;
    this.Lat = Lat;
    this.Long = Long;
}

method.getName = function(){
    return this.Name;
}

module.exports = Tag;