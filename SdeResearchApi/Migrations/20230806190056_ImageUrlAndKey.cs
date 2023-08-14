using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class ImageUrlAndKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0cbaed29-381b-4c46-b234-c280f4a8036f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3056beb5-99b0-4dd3-b404-926daf410d88");

            migrationBuilder.AddColumn<string>(
                name: "ImageKey",
                table: "TopicDetails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "TopicDetails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "29958461-40b6-4d3f-8c43-105774e05315", "94b6717c-fefc-4009-942e-77bbc3e007ba", "Administrator", "ADMINISTRATOR" },
                    { "98a3dbb0-1f4c-42d8-a0e0-8e8ae00cdfda", "b1fd8f04-c857-4b3d-8be1-28462f82213f", "User", "USER" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "29958461-40b6-4d3f-8c43-105774e05315");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "98a3dbb0-1f4c-42d8-a0e0-8e8ae00cdfda");

            migrationBuilder.DropColumn(
                name: "ImageKey",
                table: "TopicDetails");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "TopicDetails");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0cbaed29-381b-4c46-b234-c280f4a8036f", "5b5b47f2-1433-40b8-b256-a0ec05e817e7", "Administrator", "ADMINISTRATOR" },
                    { "3056beb5-99b0-4dd3-b404-926daf410d88", "eaa41dd2-486a-4be1-9685-451567efb728", "User", "USER" }
                });
        }
    }
}
