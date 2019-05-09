using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyApp.Models;

namespace MyApp.Interfaces
{
    public interface IUserSkillRepository
    {
        IEnumerable<UserSkillRelation> GetAll();
        UserSkillRelation GetById(int id);
        void Add(UserSkillRelation usRelation);
        void Update(UserSkillRelation usRelation);
        void Delete(UserSkillRelation usRelation);
        IEnumerable<UserSkillRelation> GetRelationByUserId(string id);
    }
}
