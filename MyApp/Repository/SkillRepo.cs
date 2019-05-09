using MyApp.Interfaces;
using MyApp.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace MyApp.Repository
{
    public class SkillRepo: IDisposable, ISkillRepository
    {
        private ApplicationDbContext db = new ApplicationDbContext();


        public IEnumerable<Skill> GetAll()
        {
            return db.Skills;
        }


        public Skill GetById(int id)
        {
            return db.Skills.FirstOrDefault(p => p.Id == id);
        }

        public void Add(Skill skill)
        {
            db.Skills.Add(skill);
            db.SaveChanges();
        }

        public void Update(Skill skill)
        {
            db.Entry(skill).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public void Delete(Skill skill)
        {
            db.Skills.Remove(skill);
            db.SaveChanges();
        }

        public int GetIdByName(string name)
        {
            var skill = db.Skills.FirstOrDefault(s => s.Name == name);
            return skill.Id;
        }

        protected void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (db != null)
                {
                    db.Dispose();
                    db = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}