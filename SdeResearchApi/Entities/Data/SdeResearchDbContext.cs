using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SdeResearchApi.Entities.Models;

namespace SdeResearchApi.Entities.Data
{
    public class SdeResearchDbContext : IdentityDbContext<User>
    {
#pragma warning disable CS8618
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<News> News { get; set; } = null!;
        public DbSet<Publication> Publications { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<Researcher> Researchers { get; set; } = null!;
        public DbSet<Topic> Topics { get; set; } = null!;
        public DbSet<ValidRegistrant> ValidRegistrants { get; set; } = null!;
        public DbSet<PublicationTopicCategory> PublicationTopicCategories { get; set; } = null!;
        public DbSet<TopicCategory> TopicCategories { get; set; } = null!;
        public DbSet<TopicDetails> TopicDetails { get; set; } = null!;
        public DbSet<TopicSection> TopicSections { get; set; } = null!;

        public SdeResearchDbContext(DbContextOptions<SdeResearchDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Researcher)
                .WithOne(r => r.User)
                .HasForeignKey<Researcher>(r => r.UserId)
                .IsRequired(false);

            modelBuilder.Entity<Researcher>()
                .Property(r => r.UserId)
                .IsRequired(false);

            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "User", NormalizedName = "USER".ToUpper() });
            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Administrator", NormalizedName = "ADMINISTRATOR".ToUpper() });

            Category overview = new() { CategoryId = 1, CategoryName = "Overview of SDE", Type = "academic" };
            Category k12 = new() { CategoryId = 2, CategoryName = "SDE in K-12 Organizations", Type = "academic" };
            Category homeschooling = new() { CategoryId = 3, CategoryName = "SDE in Homeschooling (Unschooling)", Type = "academic" };
            Category higherEd = new() { CategoryId = 4, CategoryName = "SDE in Higher Education", Type = "academic" };
            Category humanNature = new() { CategoryId = 5, CategoryName = "SDE, Human Nature and Well-being", Type = "academic" };
            Category philosophical = new() { CategoryId = 6, CategoryName = "Philosophical and Historical Perspectives of SDE", Type = "academic" };
            Category policy = new() { CategoryId = 7, CategoryName = "Policy Development and Challenges", Type = "academic" };
            Category democratic = new() { CategoryId = 8, CategoryName = "Democratic/Sudbury/Free Schools", Type = "practitioner" };

            modelBuilder.Entity<Category>().HasData(overview);
            modelBuilder.Entity<Category>().HasData(k12);
            modelBuilder.Entity<Category>().HasData(homeschooling);
            modelBuilder.Entity<Category>().HasData(higherEd);
            modelBuilder.Entity<Category>().HasData(humanNature);
            modelBuilder.Entity<Category>().HasData(philosophical);
            modelBuilder.Entity<Category>().HasData(policy);
            modelBuilder.Entity<Category>().HasData(democratic);
        }
    }
}