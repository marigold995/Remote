namespace MyApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _1st : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.UserSkillRelations", "UserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.UserSkillRelations", "UserId");
            CreateIndex("dbo.UserSkillRelations", "SkillId");
            AddForeignKey("dbo.UserSkillRelations", "SkillId", "dbo.Skills", "Id", cascadeDelete: true);
            AddForeignKey("dbo.UserSkillRelations", "UserId", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserSkillRelations", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.UserSkillRelations", "SkillId", "dbo.Skills");
            DropIndex("dbo.UserSkillRelations", new[] { "SkillId" });
            DropIndex("dbo.UserSkillRelations", new[] { "UserId" });
            AlterColumn("dbo.UserSkillRelations", "UserId", c => c.String());
        }
    }
}
