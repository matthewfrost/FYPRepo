using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MapTest.Models;

namespace MapTest.Models.DTOs
{
    public class Location
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Tag { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        private static FYPracticeEntities db = new FYPracticeEntities();

        public static List<Location> getAll()
        {
            var Locations = db.Location.AsEnumerable();

            List<Location> location = Locations.Select(l => new Location
            {
                ID = l.ID,
                Name = l.Name,
                Tag = l.TagName,
                Latitude = l.Latitude,
                Longitude = l.Longitude
            }).ToList();

            return location;
        }

        public static void save(Location l)
        {
            db.Location.Add(new Models.Location
            {
                Name = l.Name,
                TagName = l.Tag,
                Latitude = l.Latitude,
                Longitude = l.Longitude
            });

            db.SaveChanges();
        }
    }
}
