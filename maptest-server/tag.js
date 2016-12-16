var method = Tag.prototype;

function Tag(ID, Name, TagName, Lat, Long){
    this.ID = ID;
    this.Name = Name;
    this.TagName = TagName;
    this.Latitude = Lat;
    this.Longitude = Long;
}

method.getName = function(){
    return this.Name;
}

module.exports = Tag;