using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace ParseTextFiles
{
    class Program
    {
        static void Main(string[] args)
        {
            string file;
            string building;
            string[] readings;
            List<Reading> Readings = new List<Reading>();

            file = args[0];
            building = file.Split('.')[0];
            readings = System.IO.File.ReadAllLines(file);
            foreach(string s in readings)
            {
                string[] separated;

                separated = s.Split(',');
                Readings.Add(new Reading(building, Int64.Parse(separated[0]), DateTime.Parse(separated[1]), Int64.Parse(separated[2])));
            }
            SqlConnection conn = new SqlConnection("Server=HOMESERVER; Database=FYPRactice; Integrated Security = True");
            try
            {
                conn.Open();
            }
            catch(Exception e)
            {
                Console.Write(e.ToString());
                Console.ReadLine();
            }
            string sql = "INSERT INTO Energy(Building, MeterID, TimeStamp, Value) VALUES(@Building, @Meter, @Date, @Value)";
            foreach(Reading r in Readings)
            {

                SqlCommand command = new SqlCommand(sql, conn);

                SqlParameter buildingParam = new SqlParameter("Building", SqlDbType.NVarChar);
                buildingParam.Value = r.Building;
                command.Parameters.Add(buildingParam);

                SqlParameter meterParam = new SqlParameter("Meter", SqlDbType.BigInt);
                meterParam.Value = r.MeterID;
                command.Parameters.Add(meterParam);

                SqlParameter dateParam = new SqlParameter("Date", SqlDbType.DateTime);
                dateParam.Value = r.datetime;
                command.Parameters.Add(dateParam);

                SqlParameter valueParam = new SqlParameter("Value", SqlDbType.BigInt);
                valueParam.Value = r.Value;
                command.Parameters.Add(valueParam);

                command.ExecuteNonQuery();
            }

            conn.Close();
        }
    }
}
