using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaundryDormApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLaundryStatusSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LaundryStatus",
                keyColumn: "LaundryStatusID",
                keyValue: 1,
                column: "StatusDescription",
                value: "Aktiv");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LaundryStatus",
                keyColumn: "LaundryStatusID",
                keyValue: 1,
                column: "StatusDescription",
                value: "Aktivt tidspunkt");
        }
    }
}
