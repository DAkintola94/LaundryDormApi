using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LaundryDormApi.Migrations
{
    /// <inheritdoc />
    public partial class MachineModelSeeded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Machine",
                columns: new[] { "MachineId", "ImageFK_ID", "IsOperational", "Location", "MachineName", "ModelName" },
                values: new object[,]
                {
                    { 1, new Guid("08dd3e4e-9f82-4ada-8b37-2fb04b78b08b"), true, "Laundry room 1", "Balay", "Random" },
                    { 2, new Guid("08dd3e4e-b027-40cf-8a90-8803586722a5"), true, "Laundry room 2", "Samsung washing machine", "WW90CGC04DAH model" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Machine",
                keyColumn: "MachineId",
                keyValue: 2);
        }
    }
}
