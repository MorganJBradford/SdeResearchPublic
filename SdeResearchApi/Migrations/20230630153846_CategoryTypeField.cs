using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class CategoryTypeField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("4165f205-05cc-4a38-bc3f-88109035a39b"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("8918a354-e7d1-413e-aced-88b0d7908d71"));

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Categories",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 1,
                columns: new[] { "CategoryName", "Type" },
                values: new object[] { "Overview of SDE", "academic" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 2,
                columns: new[] { "CategoryName", "Type" },
                values: new object[] { "SDE in K-12 Organizations", "academic" });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "CategoryName", "Type" },
                values: new object[,]
                {
                    { 3, "SDE in Homeschooling (Unschooling)", "academic" },
                    { 4, "SDE in Higher Education", "academic" },
                    { 5, "SDE, Human Nature and Well-being", "academic" },
                    { 6, "Philosophical and Historical Perspectives of SDE", "academic" },
                    { 7, "Policy Development and Challenges", "academic" },
                    { 8, "Democratic/Sudbury/Free Schools", "practitioner" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("592afd63-3e6e-4b4a-b83b-4971eb8df690"), "User" },
                    { new Guid("e1152fed-a5ae-4c23-8d3c-4588e782a58e"), "Admin" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("592afd63-3e6e-4b4a-b83b-4971eb8df690"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("e1152fed-a5ae-4c23-8d3c-4588e782a58e"));

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Categories");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 1,
                column: "CategoryName",
                value: "sde");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 2,
                column: "CategoryName",
                value: "supporting");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("4165f205-05cc-4a38-bc3f-88109035a39b"), "Admin" },
                    { new Guid("8918a354-e7d1-413e-aced-88b0d7908d71"), "User" }
                });
        }
    }
}
