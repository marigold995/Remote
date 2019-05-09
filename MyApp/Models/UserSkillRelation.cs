using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyApp.Models;

namespace MyApp.Models
{
    public class UserSkillRelation
    {
        public int Id { get; set; }

        public ApplicationUser User { get; set; }
        public string UserId { get; set; }

        public Skill Skill { get; set; }
        public int SkillId { get; set; }

        public UserSkillRelation(string UserId,int SkillId)
        {
            this.UserId = UserId;
            this.SkillId = SkillId;
        }

        public UserSkillRelation()
        {

        }
        
    }
}