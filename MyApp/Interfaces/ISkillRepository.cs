using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyApp.Models;

namespace MyApp.Interfaces
{
    public interface ISkillRepository
    {
        IEnumerable<Skill> GetAll();
        Skill GetById(int id);
        void Add(Skill skill);
        void Update(Skill skill);
        void Delete(Skill skill);
        int GetIdByName(string name);
    }
}
