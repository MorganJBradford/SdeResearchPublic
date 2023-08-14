using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class AdjustResearcherAndPublication : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1319d865-a090-43e1-a3ca-1af73f8e8c40");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2fbfb346-c377-40c1-b469-7e63ba6e1c74");

            migrationBuilder.RenameColumn(
                name: "Field",
                table: "Researchers",
                newName: "Institution");

            migrationBuilder.RenameColumn(
                name: "AreaOfFocus",
                table: "Researchers",
                newName: "Department");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Publications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "10e1584e-9654-4aa0-b95e-cf53e2918ad3", "c54f3f56-a569-4da0-b4d0-8d88fc745e36", "User", "USER" },
                    { "85d6220c-93b8-4433-9110-4907f61cbbc8", "32507b0a-1e16-4df6-89c3-8327d233cdbb", "Administrator", "ADMINISTRATOR" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "10e1584e-9654-4aa0-b95e-cf53e2918ad3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "85d6220c-93b8-4433-9110-4907f61cbbc8");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Publications");

            migrationBuilder.RenameColumn(
                name: "Institution",
                table: "Researchers",
                newName: "Field");

            migrationBuilder.RenameColumn(
                name: "Department",
                table: "Researchers",
                newName: "AreaOfFocus");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1319d865-a090-43e1-a3ca-1af73f8e8c40", "96b20e7d-ef9e-4b7b-8e65-b131157456f9", "User", "USER" },
                    { "2fbfb346-c377-40c1-b469-7e63ba6e1c74", "299a7d29-b75e-49b7-85c6-caf7b8eee2fb", "Administrator", "ADMINISTRATOR" }
                });
        }
    }
}
