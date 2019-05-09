using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyApp.Models
{
    public class Skill
    {
        public int Id{ get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public Skill(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public Skill()
        {

        }
    }
}