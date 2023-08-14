using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class ResearcherCanBeWithoutUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Researchers_AspNetUsers_UserId",
                table: "Researchers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "10e5a0ef-4e9d-4a6b-8d54-5ae5fe1288b6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dc1e5759-963f-48b8-95d6-3ca973043b20");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Researchers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4587c8b5-eb4e-408b-bda2-918782aad36d", "2b83a368-147b-4c7c-8d95-f051a126cdc4", "Administrator", "ADMINISTRATOR" },
                    { "6453275b-6116-4e55-8f41-19a3a1f9e312", "b2cc9baf-9671-485c-b69c-41afefc282c9", "User", "USER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Researchers_AspNetUsers_UserId",
                table: "Researchers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Researchers_AspNetUsers_UserId",
                table: "Researchers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4587c8b5-eb4e-408b-bda2-918782aad36d");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6453275b-6116-4e55-8f41-19a3a1f9e312");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Researchers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "10e5a0ef-4e9d-4a6b-8d54-5ae5fe1288b6", "7c03e7f2-54cb-4a02-b10c-4aa5afaa9ddc", "Administrator", "ADMINISTRATOR" },
                    { "dc1e5759-963f-48b8-95d6-3ca973043b20", "7d0a3666-93db-4a39-aba1-2a4c9a714a82", "User", "USER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Researchers_AspNetUsers_UserId",
                table: "Researchers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
