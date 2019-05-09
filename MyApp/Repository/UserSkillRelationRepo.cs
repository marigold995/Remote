using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using MyApp.Interfaces;
using MyApp.Models;

namespace MyApp.Repository
{
    public class UserSkillRelationRepo : IDisposable, IUserSkillRepository
    {
        private ApplicationDbContext db = new ApplicationDbContext();


        public IEnumerable<UserSkillRelation> GetAll()
        {
            return db.Relations;
        }

        public UserSkillRelation GetById(int id)
        {
            return db.Relations.FirstOrDefault(p => p.Id == id);
        }

        public void Add(UserSkillRelation userSkillRelation)
        {
            db.Relations.Add(userSkillRelation);
            db.SaveChanges();
        }

        public void Update(UserSkillRelation userSkillRelation)
        {
            db.Entry(userSkillRelation).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public void Delete(UserSkillRelation userSkillRelation)
        {
            db.Relations.Remove(userSkillRelation);
            db.SaveChanges();
        }

        public IEnumerable<UserSkillRelation> GetRelationByUserId(string id)
        {
            var allRelations = db.Relations;
            List<UserSkillRelation> selectedRelations = new List<UserSkillRelation>();
            foreach (var rel in allRelations)
            {
                if (rel.UserId == id)
                {
                    selectedRelations.Add(rel);
                }
            }
            return selectedRelations;
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