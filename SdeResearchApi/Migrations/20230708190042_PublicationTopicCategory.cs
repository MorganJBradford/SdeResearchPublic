using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SdeResearchApi.Migrations
{
    public partial class PublicationTopicCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResearcherArticles");

            migrationBuilder.DropTable(
                name: "Articles");

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("592afd63-3e6e-4b4a-b83b-4971eb8df690"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("e1152fed-a5ae-4c23-8d3c-4588e782a58e"));

            migrationBuilder.CreateTable(
                name: "Publications",
                columns: table => new
                {
                    PublicationId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Citation = table.Column<string>(type: "text", nullable: false),
                    LinkToSource = table.Column<string>(type: "text", nullable: false),
                    PublicationUrl = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    TopicId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publications", x => x.PublicationId);
                });

            migrationBuilder.CreateTable(
                name: "PublicationTopicCategories",
                columns: table => new
                {
                    PublicationTopicCategoryId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PublicationId = table.Column<int>(type: "integer", nullable: false),
                    TopicCategoryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PublicationTopicCategories", x => x.PublicationTopicCategoryId);
                    table.ForeignKey(
                        name: "FK_PublicationTopicCategories_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "PublicationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PublicationTopicCategories_TopicCategories_TopicCategoryId",
                        column: x => x.TopicCategoryId,
                        principalTable: "TopicCategories",
                        principalColumn: "TopicCategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("57223db3-6304-49c0-82d8-bf56994aee78"), "User" },
                    { new Guid("c6451234-758b-47b5-ab7b-c595cd5f3913"), "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PublicationTopicCategories_PublicationId",
                table: "PublicationTopicCategories",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_PublicationTopicCategories_TopicCategoryId",
                table: "PublicationTopicCategories",
                column: "TopicCategoryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PublicationTopicCategories");

            migrationBuilder.DropTable(
                name: "Publications");

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("57223db3-6304-49c0-82d8-bf56994aee78"));

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValue: new Guid("c6451234-758b-47b5-ab7b-c595cd5f3913"));

            migrationBuilder.CreateTable(
                name: "Articles",
                columns: table => new
                {
                    ArticleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ArticleData = table.Column<byte[]>(type: "bytea", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.ArticleId);
                });

            migrationBuilder.CreateTable(
                name: "ResearcherArticles",
                columns: table => new
                {
                    ResearcherArticleId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ArticleId = table.Column<int>(type: "integer", nullable: false),
                    ResearcherId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResearcherArticles", x => x.ResearcherArticleId);
                    table.ForeignKey(
                        name: "FK_ResearcherArticles_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "Articles",
                        principalColumn: "ArticleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResearcherArticles_Researchers_ResearcherId",
                        column: x => x.ResearcherId,
                        principalTable: "Researchers",
                        principalColumn: "ResearcherId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Type" },
                values: new object[,]
                {
                    { new Guid("592afd63-3e6e-4b4a-b83b-4971eb8df690"), "User" },
                    { new Guid("e1152fed-a5ae-4c23-8d3c-4588e782a58e"), "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ResearcherArticles_ArticleId",
                table: "ResearcherArticles",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_ResearcherArticles_ResearcherId",
                table: "ResearcherArticles",
                column: "ResearcherId");
        }
    }
}
