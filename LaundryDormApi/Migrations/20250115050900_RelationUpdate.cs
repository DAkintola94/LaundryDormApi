using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaundryDormApi.Migrations
{
    /// <inheritdoc />
    public partial class RelationUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ImageFK_ID",
                table: "Machine",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 1,
                columns: new[] { "ImageFK_ID", "MachineName", "ModelName" },
                values: new object[] { new Guid("08dd3513-8481-4ab7-8ae8-28e6cee0c26e"), "Balay", "Random" });

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 2,
                columns: new[] { "ImageFK_ID", "MachineName", "ModelName" },
                values: new object[] { new Guid("08dd3514-195d-432b-8baa-9fb70ae4a679"), "Samsung washing machine", "WW90CGC04DAH model" });

            migrationBuilder.CreateIndex(
                name: "IX_Machine_ImageFK_ID",
                table: "Machine",
                column: "ImageFK_ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Machine_Image_ImageFK_ID",
                table: "Machine",
                column: "ImageFK_ID",
                principalTable: "Image",
                principalColumn: "ImageId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Machine_Image_ImageFK_ID",
                table: "Machine");

            migrationBuilder.DropIndex(
                name: "IX_Machine_ImageFK_ID",
                table: "Machine");

            migrationBuilder.DropColumn(
                name: "ImageFK_ID",
                table: "Machine");

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 1,
                columns: new[] { "MachineName", "ModelName" },
                values: new object[] { "Bosch", "WAE24460" });

            migrationBuilder.UpdateData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 2,
                columns: new[] { "MachineName", "ModelName" },
                values: new object[] { "Electrolux", "EW6F5247G5" });
        }
    }
}
