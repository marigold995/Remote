using MyApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MyApp.Interfaces
{
    public interface IUserRepository
    {
        IEnumerable<ApplicationUser> GetAll();
        ApplicationUser GetById(string id);
        void Add(ApplicationUser user);
        void Update(ApplicationUser user);
        void Delete(ApplicationUser user);
        string GetIdByEmail(string email);
    }
}
