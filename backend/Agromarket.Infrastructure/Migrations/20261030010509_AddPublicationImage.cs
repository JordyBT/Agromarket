using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Agromarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicationImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Publications",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Publications");
        }
    }
}
