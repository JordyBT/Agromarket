using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agromarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicationDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Publications",
                type: "character varying(80)",
                maxLength: 80,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "Publications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MinimumOrder",
                table: "Publications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Municipality",
                table: "Publications",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Publications");

            migrationBuilder.DropColumn(
                name: "Department",
                table: "Publications");

            migrationBuilder.DropColumn(
                name: "MinimumOrder",
                table: "Publications");

            migrationBuilder.DropColumn(
                name: "Municipality",
                table: "Publications");
        }
    }
}
