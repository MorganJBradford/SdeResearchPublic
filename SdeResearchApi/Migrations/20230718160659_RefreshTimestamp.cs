using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class RefreshTimestamp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "03910214-8ab3-4938-b7df-c4af8318d7bc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "da28031c-6d80-4113-869b-d84b84afa0ce");

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "RefreshTokens",
                type: "bytea",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1319d865-a090-43e1-a3ca-1af73f8e8c40", "96b20e7d-ef9e-4b7b-8e65-b131157456f9", "User", "USER" },
                    { "2fbfb346-c377-40c1-b469-7e63ba6e1c74", "299a7d29-b75e-49b7-85c6-caf7b8eee2fb", "Administrator", "ADMINISTRATOR" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1319d865-a090-43e1-a3ca-1af73f8e8c40");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2fbfb346-c377-40c1-b469-7e63ba6e1c74");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "RefreshTokens");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "03910214-8ab3-4938-b7df-c4af8318d7bc", "c94cbee1-3585-402c-9636-2d9d200b9817", "Administrator", "ADMINISTRATOR" },
                    { "da28031c-6d80-4113-869b-d84b84afa0ce", "409d9269-adfe-4193-9c5b-9c35e46f2d39", "User", "USER" }
                });
        }
    }
}
