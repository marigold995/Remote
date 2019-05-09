using MyApp.Interfaces;
using MyApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyApp.Controllers
{
    [RoutePrefix("api/UserSkillRel")]
    public class UserSkillRelController : ApiController
    {
        IUserSkillRepository _repository { get; set; }

        public UserSkillRelController(IUserSkillRepository repository)
        {
            _repository = repository;
        }
        [AllowAnonymous]       
        [HttpPost]
        public IHttpActionResult Add(UserSkillRelation userSkillRelation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _repository.Add(userSkillRelation);
            return CreatedAtRoute("DefaultApi", new { id = userSkillRelation.Id }, userSkillRelation);
        }
        [Authorize]
        [HttpDelete]        
        public IHttpActionResult Delete(int id)
        {
            var relation = _repository.GetById(id);
            if (relation == null)
            {
                return NotFound();
            }

            _repository.Delete(relation);
            return Ok();

        }
        [Authorize]
        public IHttpActionResult GetRelationByUserId(string id)
        {
            var relations = _repository.GetRelationByUserId(id);
            if (relations == null)
            {
                return NotFound();
            }
            return Ok(relations);
        }      
    }
}
