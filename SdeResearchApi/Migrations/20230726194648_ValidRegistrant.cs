using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class ValidRegistrant : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "10e1584e-9654-4aa0-b95e-cf53e2918ad3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "85d6220c-93b8-4433-9110-4907f61cbbc8");

            migrationBuilder.CreateTable(
                name: "ValidRegistrants",
                columns: table => new
                {
                    RegistrantId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RegistrantEmail = table.Column<string>(type: "text", nullable: false),
                    ResearcherId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValidRegistrants", x => x.RegistrantId);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "416cc2c2-ef08-4a8a-8ea9-00b0abe73f6a", "3c595086-f040-40e2-93ed-79284fb390fa", "Administrator", "ADMINISTRATOR" },
                    { "58ada61f-2cdc-470a-b7bc-dcf9a1297174", "c9bb22d5-3181-42ec-8935-d54d97272ce8", "User", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValidRegistrants");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "416cc2c2-ef08-4a8a-8ea9-00b0abe73f6a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "58ada61f-2cdc-470a-b7bc-dcf9a1297174");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "10e1584e-9654-4aa0-b95e-cf53e2918ad3", "c54f3f56-a569-4da0-b4d0-8d88fc745e36", "User", "USER" },
                    { "85d6220c-93b8-4433-9110-4907f61cbbc8", "32507b0a-1e16-4df6-89c3-8327d233cdbb", "Administrator", "ADMINISTRATOR" }
                });
        }
    }
}
