using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LaundryDormApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 4);

            migrationBuilder.AlterColumn<string>(
                name: "ModelName",
                table: "Machine",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MachineName",
                table: "Machine",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Machine",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Advice",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 2,
                columns: new[] { "Location", "MachineName", "ModelName" },
                values: new object[] { "Laundry room 2", "Electrolux", "EW6F5247G5" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Advice");

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "ModelName",
                keyValue: null,
                column: "ModelName",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "ModelName",
                table: "Machine",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "MachineName",
                keyValue: null,
                column: "MachineName",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MachineName",
                table: "Machine",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "Location",
                keyValue: null,
                column: "Location",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Machine",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 2,
                columns: new[] { "Location", "MachineName", "ModelName" },
                values: new object[] { "Laundry room 1", "Miele", "WDB 030 WCS" });

            migrationBuilder.InsertData(
                table: "Machine",
                columns: new[] { "MachineId", "IsOperational", "Location", "MachineName", "ModelName" },
                values: new object[,]
                {
                    { 3, true, "Laundry room 2", "Siemens", "WM14N200DN" },
                    { 4, true, "Laundry room 2", "Electrolux", "EW6F5247G5" }
                });
        }
    }
}
