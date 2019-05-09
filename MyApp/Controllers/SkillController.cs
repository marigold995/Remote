using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MyApp.Models;
using MyApp.Interfaces;
using System.Web.Http.Description;

namespace MyApp.Controllers
{
    
    public class SkillController : ApiController
    {
        ISkillRepository _repository { get; set; }

        public SkillController(ISkillRepository repository)
        {
            _repository = repository;
        }
        [Authorize]
        public IEnumerable<Skill> Get()
        {
            return _repository.GetAll();
        }
        [Authorize]
        public IHttpActionResult Get(int id)
        {
            var skill = _repository.GetById(id);
            if (skill == null)
            {
                return NotFound();
            }
            return Ok(skill);
        }
        
        [HttpPost]
        public IHttpActionResult Add(Skill skill)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _repository.Add(skill);
            return CreatedAtRoute("DefaultApi", new { id = skill.Id }, skill);
        }
        
        [HttpGet]        
        public IHttpActionResult Search(string name)
        {
            var skillId = _repository.GetIdByName(name);
            return Ok(skillId);
        }
    }
}
