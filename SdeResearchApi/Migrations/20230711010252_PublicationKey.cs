using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class PublicationKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("57223db3-6304-49c0-82d8-bf56994aee78"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("c6451234-758b-47b5-ab7b-c595cd5f3913"));

            migrationBuilder.DropColumn(
                name: "TopicId",
                table: "Publications");

            migrationBuilder.AddColumn<string>(
                name: "PublicationKey",
                table: "Publications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("4d69b66a-d085-4e74-b51b-660ed35f43ca"), "User" },
                    { new Guid("73f526b2-dd30-4856-a9d3-561d592fcdfe"), "Admin" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("4d69b66a-d085-4e74-b51b-660ed35f43ca"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("73f526b2-dd30-4856-a9d3-561d592fcdfe"));

            migrationBuilder.DropColumn(
                name: "PublicationKey",
                table: "Publications");

            migrationBuilder.AddColumn<int>(
                name: "TopicId",
                table: "Publications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("57223db3-6304-49c0-82d8-bf56994aee78"), "User" },
                    { new Guid("c6451234-758b-47b5-ab7b-c595cd5f3913"), "Admin" }
                });
        }
    }
}
