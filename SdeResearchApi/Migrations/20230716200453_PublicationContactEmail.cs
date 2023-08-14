using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class PublicationContactEmail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7f959f78-f345-401b-a750-22c563e6ec30");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "84956b15-142c-4633-a9c3-4570d3a5d68c");

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "Publications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "03910214-8ab3-4938-b7df-c4af8318d7bc", "c94cbee1-3585-402c-9636-2d9d200b9817", "Administrator", "ADMINISTRATOR" },
                    { "da28031c-6d80-4113-869b-d84b84afa0ce", "409d9269-adfe-4193-9c5b-9c35e46f2d39", "User", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "03910214-8ab3-4938-b7df-c4af8318d7bc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "da28031c-6d80-4113-869b-d84b84afa0ce");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "Publications");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7f959f78-f345-401b-a750-22c563e6ec30", "a82c2b6c-a161-48b0-894e-b9d9c872013b", "User", "USER" },
                    { "84956b15-142c-4633-a9c3-4570d3a5d68c", "83784e52-aa75-41fa-acf6-b5f2ab895d49", "Administrator", "ADMINISTRATOR" }
                });
        }
    }
}
