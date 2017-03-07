using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseTextFiles
{
    class Reading
    {
        public string Building;
        public Int64 MeterID;
       public DateTime datetime;
       public Int64 Value;

        public Reading(string building, Int64 id, DateTime date, Int64 value)
        {
            MeterID = id;
            datetime = date;
            Value = value;
            Building = building;
        }
    }
}
