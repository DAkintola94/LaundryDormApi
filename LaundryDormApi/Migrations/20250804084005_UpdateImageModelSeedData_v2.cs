using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LaundryDormApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateImageModelSeedData_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Image",
                keyColumn: "ImageId",
                keyValue: new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                column: "ImagePath",
                value: "https://localhost:7054/ServerImages/Siemen.jpg");

            migrationBuilder.UpdateData(
                table: "Image",
                keyColumn: "ImageId",
                keyValue: new Guid("b7e2a1c4-3f6a-4e2e-9b7a-2c8e1d4f5a6b"),
                column: "ImagePath",
                value: "https://localhost:7054/ServerImages/Balay.jpg");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Image",
                keyColumn: "ImageId",
                keyValue: new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                column: "ImagePath",
                value: "https://localhost:7054/ServerImage/Siemen.jpg");

            migrationBuilder.UpdateData(
                table: "Image",
                keyColumn: "ImageId",
                keyValue: new Guid("b7e2a1c4-3f6a-4e2e-9b7a-2c8e1d4f5a6b"),
                column: "ImagePath",
                value: "https://localhost:7054/ServerImage/Balay.jpg");
        }
    }
}
