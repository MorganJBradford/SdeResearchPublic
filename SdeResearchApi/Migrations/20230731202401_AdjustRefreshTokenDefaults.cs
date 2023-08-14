using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class AdjustRefreshTokenDefaults : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4587c8b5-eb4e-408b-bda2-918782aad36d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6453275b-6116-4e55-8f41-19a3a1f9e312");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0cbaed29-381b-4c46-b234-c280f4a8036f", "5b5b47f2-1433-40b8-b256-a0ec05e817e7", "Administrator", "ADMINISTRATOR" },
                    { "3056beb5-99b0-4dd3-b404-926daf410d88", "eaa41dd2-486a-4be1-9685-451567efb728", "User", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0cbaed29-381b-4c46-b234-c280f4a8036f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3056beb5-99b0-4dd3-b404-926daf410d88");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4587c8b5-eb4e-408b-bda2-918782aad36d", "2b83a368-147b-4c7c-8d95-f051a126cdc4", "Administrator", "ADMINISTRATOR" },
                    { "6453275b-6116-4e55-8f41-19a3a1f9e312", "b2cc9baf-9671-485c-b69c-41afefc282c9", "User", "USER" }
                });
        }
    }
}
