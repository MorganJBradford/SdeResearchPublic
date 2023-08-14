using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class TopicCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryName",
                keyValue: "sde");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryName",
                keyValue: "supporting");

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("610000a5-de26-4621-a067-980cd4ed95fa"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("682ffede-e9be-444e-8780-ffc924461fc3"));

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Categories",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "CategoryId");

            migrationBuilder.CreateTable(
                name: "TopicCategories",
                columns: table => new
                {
                    TopicCategoryId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TopicId = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TopicCategories", x => x.TopicCategoryId);
                    table.ForeignKey(
                        name: "FK_TopicCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TopicCategories_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "TopicId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "CategoryName" },
                values: new object[,]
                {
                    { 1, "sde" },
                    { 2, "supporting" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("4165f205-05cc-4a38-bc3f-88109035a39b"), "Admin" },
                    { new Guid("8918a354-e7d1-413e-aced-88b0d7908d71"), "User" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TopicCategories_CategoryId",
                table: "TopicCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TopicCategories_TopicId",
                table: "TopicCategories",
                column: "TopicId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TopicCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("4165f205-05cc-4a38-bc3f-88109035a39b"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("8918a354-e7d1-413e-aced-88b0d7908d71"));

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Categories");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "CategoryName");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("610000a5-de26-4621-a067-980cd4ed95fa"), "User" },
                    { new Guid("682ffede-e9be-444e-8780-ffc924461fc3"), "Admin" }
                });
        }
    }
}
