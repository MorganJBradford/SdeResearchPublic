using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class RemoveUserReferenceIdField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2006eb89-4c1d-4f57-80a4-bbf122a0ec70");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8981b179-ff0b-4f0f-9d6e-ed5c6bcc58bf");

            migrationBuilder.DropColumn(
                name: "UserReferenceId",
                table: "RefreshTokens");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7f959f78-f345-401b-a750-22c563e6ec30", "a82c2b6c-a161-48b0-894e-b9d9c872013b", "User", "USER" },
                    { "84956b15-142c-4633-a9c3-4570d3a5d68c", "83784e52-aa75-41fa-acf6-b5f2ab895d49", "Administrator", "ADMINISTRATOR" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "UserReferenceId",
                table: "RefreshTokens",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2006eb89-4c1d-4f57-80a4-bbf122a0ec70", "cc88380d-cd40-464a-972d-bdb91c2b212b", "Administrator", "ADMINISTRATOR" },
                    { "8981b179-ff0b-4f0f-9d6e-ed5c6bcc58bf", "19678a08-1666-4773-9984-2400c4bec539", "User", "USER" }
                });
        }
    }
}
