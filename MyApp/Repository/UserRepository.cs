using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using MyApp.Interfaces;
using MyApp.Models;

namespace MyApp.Repository
{
    public class UserRepository : IDisposable, IUserRepository
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        public IEnumerable<ApplicationUser> GetAll()
        {
            return db.Users.ToList();
        }

        public ApplicationUser GetById(string id)
        {
            return db.Users.FirstOrDefault(u => u.Id == id);
        }

        public string GetIdByEmail(string email)
        {
            var user = db.Users.FirstOrDefault(s => s.Email == email);
            return user.Id;
        }

        private int Int32(string id)
        {
            throw new NotImplementedException();
        }

        public void Add(ApplicationUser user)
        {
            throw new NotImplementedException();
        }

        public void Update(ApplicationUser user)
        {
            db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbEntityValidationException)
            {
                throw;
            }
        }

        public void Delete(ApplicationUser user)
        {
            db.Users.Remove(user);
            db.SaveChanges();
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