using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class TempPassword : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "416cc2c2-ef08-4a8a-8ea9-00b0abe73f6a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "58ada61f-2cdc-470a-b7bc-dcf9a1297174");

            migrationBuilder.AddColumn<string>(
                name: "TempPassword",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "10e5a0ef-4e9d-4a6b-8d54-5ae5fe1288b6", "7c03e7f2-54cb-4a02-b10c-4aa5afaa9ddc", "Administrator", "ADMINISTRATOR" },
                    { "dc1e5759-963f-48b8-95d6-3ca973043b20", "7d0a3666-93db-4a39-aba1-2a4c9a714a82", "User", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "10e5a0ef-4e9d-4a6b-8d54-5ae5fe1288b6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dc1e5759-963f-48b8-95d6-3ca973043b20");

            migrationBuilder.DropColumn(
                name: "TempPassword",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "416cc2c2-ef08-4a8a-8ea9-00b0abe73f6a", "3c595086-f040-40e2-93ed-79284fb390fa", "Administrator", "ADMINISTRATOR" },
                    { "58ada61f-2cdc-470a-b7bc-dcf9a1297174", "c9bb22d5-3181-42ec-8935-d54d97272ce8", "User", "USER" }
                });
        }
    }
}
