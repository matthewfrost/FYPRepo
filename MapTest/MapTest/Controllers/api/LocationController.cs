using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MapTest.Models;
namespace MapTest.Controllers.api
{
    public class LocationController : ApiController
    {
        // GET api/<controller>
        public List<Models.DTOs.Location> Get()
        {
            return Models.DTOs.Location.getAll();
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]Models.DTOs.Location l)
        {
            Models.DTOs.Location.save(l);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}