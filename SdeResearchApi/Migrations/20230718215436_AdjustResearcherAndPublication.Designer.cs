﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using SdeResearchApi.Entities.Data;

#nullable disable

namespace SdeResearchApi.Migrations
{
    [DbContext(typeof(SdeResearchDbContext))]
    [Migration("20230718215436_AdjustResearcherAndPublication")]
    partial class AdjustResearcherAndPublication
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.18")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "10e1584e-9654-4aa0-b95e-cf53e2918ad3",
                            ConcurrencyStamp = "c54f3f56-a569-4da0-b4d0-8d88fc745e36",
                            Name = "User",
                            NormalizedName = "USER"
                        },
                        new
                        {
                            Id = "85d6220c-93b8-4433-9110-4907f61cbbc8",
                            ConcurrencyStamp = "32507b0a-1e16-4df6-89c3-8327d233cdbb",
                            Name = "Administrator",
                            NormalizedName = "ADMINISTRATOR"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("CategoryId"));

                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");

                    b.HasData(
                        new
                        {
                            CategoryId = 1,
                            CategoryName = "Overview of SDE",
                            Type = "academic"
                        },
                        new
                        {
                            CategoryId = 2,
                            CategoryName = "SDE in K-12 Organizations",
                            Type = "academic"
                        },
                        new
                        {
                            CategoryId = 3,
                            CategoryName = "SDE in Homeschooling (Unschooling)",
                            Type = "academic"
                        },
                        new
                        {
                            CategoryId = 4,
                            CategoryName = "SDE in Higher Education",
                            Type = "academic"
                        },
                        new
                        {
                            CategoryId = 5,
                            CategoryName = "SDE, Human Nature and Well-being",
                            Type = "academic"
                        },
                        new
                        {
                            CategoryId = 6,
                            CategoryName = "Philosophical and Historical Perspectives of SDE",
                            Type = "academic"
                        },
                        new
                        {
                            CategoryId = 7,
                            CategoryName = "Policy Development and Challenges",
                            Type = "academic"
                        },
                        new
                        {
                            CategoryId = 8,
                            CategoryName = "Democratic/Sudbury/Free Schools",
                            Type = "practitioner"
                        });
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.News", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("News");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Publication", b =>
                {
                    b.Property<int>("PublicationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PublicationId"));

                    b.Property<string>("Citation")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ContactEmail")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsPublished")
                        .HasColumnType("boolean");

                    b.Property<string>("LinkToSource")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PublicationKey")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PublicationUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PublicationId");

                    b.ToTable("Publications");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.PublicationTopicCategory", b =>
                {
                    b.Property<int>("PublicationTopicCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PublicationTopicCategoryId"));

                    b.Property<int>("PublicationId")
                        .HasColumnType("integer");

                    b.Property<int>("TopicCategoryId")
                        .HasColumnType("integer");

                    b.HasKey("PublicationTopicCategoryId");

                    b.HasIndex("PublicationId");

                    b.HasIndex("TopicCategoryId");

                    b.ToTable("PublicationTopicCategories");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.RefreshToken", b =>
                {
                    b.Property<int>("RefreshTokenId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("RefreshTokenId"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("Expires")
                        .HasColumnType("timestamp with time zone");

                    b.Property<byte[]>("RowVersion")
                        .IsConcurrencyToken()
                        .IsRequired()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("bytea");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("RefreshTokenId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("RefreshTokens");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Researcher", b =>
                {
                    b.Property<int>("ResearcherId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ResearcherId"));

                    b.Property<string>("Biography")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Department")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("HasAdminApprovedProfile")
                        .HasColumnType("boolean");

                    b.Property<string>("ImageName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Institution")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ProfilePicture")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ResearcherId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Researchers");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Topic", b =>
                {
                    b.Property<int>("TopicId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TopicId"));

                    b.Property<bool>("IsTopicPagePublished")
                        .HasColumnType("boolean");

                    b.Property<string>("TopicName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("TopicId");

                    b.ToTable("Topics");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicCategory", b =>
                {
                    b.Property<int>("TopicCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TopicCategoryId"));

                    b.Property<int>("CategoryId")
                        .HasColumnType("integer");

                    b.Property<int>("TopicId")
                        .HasColumnType("integer");

                    b.HasKey("TopicCategoryId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("TopicId");

                    b.ToTable("TopicCategories");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicDetails", b =>
                {
                    b.Property<int>("TopicDetailsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TopicDetailsId"));

                    b.Property<int>("ResearcherId")
                        .HasColumnType("integer");

                    b.Property<int>("TopicId")
                        .HasColumnType("integer");

                    b.HasKey("TopicDetailsId");

                    b.HasIndex("ResearcherId");

                    b.HasIndex("TopicId")
                        .IsUnique();

                    b.ToTable("TopicDetails");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicSection", b =>
                {
                    b.Property<int>("SectionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SectionId"));

                    b.Property<int>("DisplayOrder")
                        .HasColumnType("integer");

                    b.Property<string>("SectionBody")
                        .HasColumnType("text");

                    b.Property<string>("SectionTitle")
                        .HasColumnType("text");

                    b.Property<int>("TopicDetailsId")
                        .HasColumnType("integer");

                    b.HasKey("SectionId");

                    b.HasIndex("TopicDetailsId");

                    b.ToTable("TopicSections");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SdeResearchApi.Entities.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.PublicationTopicCategory", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.Publication", "Publication")
                        .WithMany("PublicationTopicCategories")
                        .HasForeignKey("PublicationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SdeResearchApi.Entities.Models.TopicCategory", "TopicCategory")
                        .WithMany("PublicationTopicCategories")
                        .HasForeignKey("TopicCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Publication");

                    b.Navigation("TopicCategory");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.RefreshToken", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.User", null)
                        .WithOne("RefreshToken")
                        .HasForeignKey("SdeResearchApi.Entities.Models.RefreshToken", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Researcher", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.User", "User")
                        .WithOne("Researcher")
                        .HasForeignKey("SdeResearchApi.Entities.Models.Researcher", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicCategory", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.Category", "Category")
                        .WithMany("TopicCategories")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SdeResearchApi.Entities.Models.Topic", "Topic")
                        .WithMany("TopicCategories")
                        .HasForeignKey("TopicId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("Topic");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicDetails", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.Researcher", "Researcher")
                        .WithMany("TopicDetails")
                        .HasForeignKey("ResearcherId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SdeResearchApi.Entities.Models.Topic", "Topic")
                        .WithOne("Details")
                        .HasForeignKey("SdeResearchApi.Entities.Models.TopicDetails", "TopicId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Researcher");

                    b.Navigation("Topic");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicSection", b =>
                {
                    b.HasOne("SdeResearchApi.Entities.Models.TopicDetails", "TopicDetails")
                        .WithMany("Sections")
                        .HasForeignKey("TopicDetailsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TopicDetails");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Category", b =>
                {
                    b.Navigation("TopicCategories");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Publication", b =>
                {
                    b.Navigation("PublicationTopicCategories");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Researcher", b =>
                {
                    b.Navigation("TopicDetails");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.Topic", b =>
                {
                    b.Navigation("Details");

                    b.Navigation("TopicCategories");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicCategory", b =>
                {
                    b.Navigation("PublicationTopicCategories");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.TopicDetails", b =>
                {
                    b.Navigation("Sections");
                });

            modelBuilder.Entity("SdeResearchApi.Entities.Models.User", b =>
                {
                    b.Navigation("RefreshToken");

                    b.Navigation("Researcher");
                });
#pragma warning restore 612, 618
        }
    }
}
