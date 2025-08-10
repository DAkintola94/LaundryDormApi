using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LaundryDormApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialDBMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AdviceStatus",
                columns: table => new
                {
                    AdviceStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StatusDescription = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdviceStatus", x => x.AdviceStatusId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CategoryName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.CategoryId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Image",
                columns: table => new
                {
                    ImageId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ImageName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageExtension = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageSizeInBytes = table.Column<long>(type: "bigint", nullable: true),
                    ImagePath = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Image", x => x.ImageId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LaundryStatus",
                columns: table => new
                {
                    LaundryStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StatusDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LaundryStatus", x => x.LaundryStatusID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TimeStamp",
                columns: table => new
                {
                    PeriodId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Start = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    End = table.Column<TimeSpan>(type: "time(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeStamp", x => x.PeriodId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UpdatedLaundryCount",
                columns: table => new
                {
                    UpdateCountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AmountOfCount = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpdatedLaundryCount", x => x.UpdateCountId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Advice",
                columns: table => new
                {
                    PosterId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PosterName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Message = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    AdminInspectionDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    InspectedByAdmin = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AdminEmail = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Advice", x => x.PosterId);
                    table.ForeignKey(
                        name: "FK_Advice_AdviceStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "AdviceStatus",
                        principalColumn: "AdviceStatusId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Advice_Category_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Category",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Machine",
                columns: table => new
                {
                    MachineId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MachineName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ModelName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsOperational = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Location = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageFK_ID = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Machine", x => x.MachineId);
                    table.ForeignKey(
                        name: "FK_Machine_Image_ImageFK_ID",
                        column: x => x.ImageFK_ID,
                        principalTable: "Image",
                        principalColumn: "ImageId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Laundry",
                columns: table => new
                {
                    LaundrySessionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserEmail = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReservationTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ReservedDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Message = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LaundryStatusID = table.Column<int>(type: "int", nullable: true),
                    TimePeriodId = table.Column<int>(type: "int", nullable: false),
                    LaundrySessionStartTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LaundrySessionEndTime = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LaundryEndTime = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MachineId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Laundry", x => x.LaundrySessionId);
                    table.ForeignKey(
                        name: "FK_Laundry_LaundryStatus_LaundryStatusID",
                        column: x => x.LaundryStatusID,
                        principalTable: "LaundryStatus",
                        principalColumn: "LaundryStatusID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Laundry_Machine_MachineId",
                        column: x => x.MachineId,
                        principalTable: "Machine",
                        principalColumn: "MachineId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Laundry_TimeStamp_TimePeriodId",
                        column: x => x.TimePeriodId,
                        principalTable: "TimeStamp",
                        principalColumn: "PeriodId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AdviceStatus",
                columns: new[] { "AdviceStatusId", "StatusDescription" },
                values: new object[,]
                {
                    { 1, "Ikke inspisert" },
                    { 2, "Inspisert" }
                });

            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "CategoryId", "CategoryName" },
                values: new object[,]
                {
                    { 1, "Forbedring" },
                    { 2, "Vedlikehold" },
                    { 3, "Feil" },
                    { 4, "Annet" }
                });

            migrationBuilder.InsertData(
                table: "Image",
                columns: new[] { "ImageId", "ImageDescription", "ImageExtension", "ImageName", "ImagePath", "ImageSizeInBytes" },
                values: new object[,]
                {
                    { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), "Siemen machine picture", ".jpg", "washing machine", "https://localhost:7054/ServerImages/Siemen.jpg", 337200L },
                    { new Guid("b7e2a1c4-3f6a-4e2e-9b7a-2c8e1d4f5a6b"), "Balay washing machine", ".jpg", "BalayMachine", "https://localhost:7054/ServerImages/Balay.jpg", 380876L }
                });

            migrationBuilder.InsertData(
                table: "LaundryStatus",
                columns: new[] { "LaundryStatusID", "StatusDescription" },
                values: new object[,]
                {
                    { 1, "Aktiv" },
                    { 2, "Utløpt" },
                    { 3, "Service pågår!" },
                    { 4, "Reservert" },
                    { 5, "Kansellert" }
                });

            migrationBuilder.InsertData(
                table: "TimeStamp",
                columns: new[] { "PeriodId", "End", "Start" },
                values: new object[,]
                {
                    { 1, new TimeSpan(0, 12, 0, 0, 0), new TimeSpan(0, 7, 0, 0, 0) },
                    { 2, new TimeSpan(0, 17, 0, 0, 0), new TimeSpan(0, 12, 0, 0, 0) },
                    { 3, new TimeSpan(0, 23, 0, 0, 0), new TimeSpan(0, 17, 0, 0, 0) }
                });

            migrationBuilder.InsertData(
                table: "Machine",
                columns: new[] { "MachineId", "ImageFK_ID", "IsOperational", "Location", "MachineName", "ModelName" },
                values: new object[,]
                {
                    { 1, new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), true, "Laundry room 1", "Siemen", "washing machine" },
                    { 2, new Guid("b7e2a1c4-3f6a-4e2e-9b7a-2c8e1d4f5a6b"), true, "Laundry room 2", "Samsung washing machine", "WW90CGC04DAH model" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Advice_CategoryID",
                table: "Advice",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Advice_StatusId",
                table: "Advice",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Laundry_LaundryStatusID",
                table: "Laundry",
                column: "LaundryStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Laundry_MachineId",
                table: "Laundry",
                column: "MachineId");

            migrationBuilder.CreateIndex(
                name: "IX_Laundry_TimePeriodId",
                table: "Laundry",
                column: "TimePeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_Machine_ImageFK_ID",
                table: "Machine",
                column: "ImageFK_ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Advice");

            migrationBuilder.DropTable(
                name: "Laundry");

            migrationBuilder.DropTable(
                name: "UpdatedLaundryCount");

            migrationBuilder.DropTable(
                name: "AdviceStatus");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "LaundryStatus");

            migrationBuilder.DropTable(
                name: "Machine");

            migrationBuilder.DropTable(
                name: "TimeStamp");

            migrationBuilder.DropTable(
                name: "Image");
        }
    }
}
