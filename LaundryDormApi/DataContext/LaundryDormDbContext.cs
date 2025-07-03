using LaundryDormApi.Model.DomainModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.DataContext
{
    public class LaundryDormDbContext : DbContext
    {
        public LaundryDormDbContext(DbContextOptions<LaundryDormDbContext> dbContextOptions) : base(dbContextOptions)
        {

        }
        public DbSet<LaundrySession> Laundry { get; set; }
        public DbSet<AdviceSet> Advice { get; set; }
        public DbSet<LaundryStatusState> LaundryStatus { get; set; }
        public DbSet<ImageModel> Image { get; set; }
        public DbSet<MaintenanceLogModel> MaintenanceLog { get; set; }
        public DbSet<MachineModel> Machine { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<UpdateCountModel> UpdatedLaundryCount { get; set; }
        public DbSet<TimePeriodModel> TimeStamp { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //seeding primarykey
            modelBuilder.Entity<LaundryStatusState>().HasKey(x => x.LaundryStatusID);
            modelBuilder.Entity<MachineModel>().HasKey(x => x.MachineId);
            modelBuilder.Entity<MaintenanceLogModel>().HasKey(x => x.MaintenanceLogId);
            modelBuilder.Entity<AdviceSet>().HasKey(x => x.PosterId);
            modelBuilder.Entity<LaundrySession>().HasKey(x => x.LaundrySessionId);
            modelBuilder.Entity<ImageModel>().HasKey(x => x.ImageId);
            modelBuilder.Entity<UpdateCountModel>().HasKey(x => x.UpdateCountId);
            modelBuilder.Entity<TimePeriodModel>().HasKey(x => x.PeriodId);

            modelBuilder.Entity<LaundrySession>()
                .HasOne(ls => ls.LaundryStatus)
                .WithMany()
                .HasForeignKey(ls => ls.LaundryStatusID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LaundrySession>()
                .HasOne(ls => ls.Machine)
                .WithMany()
                .HasForeignKey(ls => ls.MachineId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LaundrySession>()
                .HasOne(tp => tp.TimePeriod)
                .WithMany()
                .HasForeignKey(id => id.TimePeriodId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MachineModel>()
                .HasOne(im => im.Image)
                .WithMany()
                .HasForeignKey(imageId => imageId.ImageFK_ID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MaintenanceLogModel>()
                .HasOne(ml => ml.Machine)
                .WithMany()
                .HasForeignKey(ml => ml.MachineId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<MaintenanceLogModel>()
                .HasOne(ls => ls.StatusState)
                .WithMany()
                .HasForeignKey(ls => ls.LaundryStatusIdentifier)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AdviceSet>()
                .HasOne(ad => ad.CategoryModel)
                .WithMany()
                .HasForeignKey(ad => ad.CategoryID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LaundryStatusState>().HasData( //seeding data, always seed when its something that should be permanent in the database/problem domain
               new LaundryStatusState { LaundryStatusID = 1, StatusDescription = "Aktivt tidspunkt" },
               new LaundryStatusState { LaundryStatusID = 2, StatusDescription = "Utløpt" },
               new LaundryStatusState { LaundryStatusID = 3, StatusDescription = "Stoppet!" },
               new LaundryStatusState { LaundryStatusID = 4, StatusDescription = "Service pågår!" },
               new LaundryStatusState { LaundryStatusID = 5, StatusDescription = "Service ferdig!" },
               new LaundryStatusState { LaundryStatusID = 6, StatusDescription = "Reservert"}
           );

            modelBuilder.Entity<MachineModel>().HasData( //seeding machine model version in the database, FK is based on the GUID PK for the image table
            new MachineModel {
            MachineId = 1, MachineName = "Siemen",
            ModelName = "washing machine",
            IsOperational = true,
            Location = "Laundry room 1",
            ImageFK_ID = new Guid ("a1b2c3d4-e5f6-7890-abcd-ef1234567890") //Attaching/seeding the image to the specific machine through foreign key 
            },

            new MachineModel {
            MachineId = 2,
            MachineName = "Samsung washing machine",
            ModelName = "WW90CGC04DAH model",
            IsOperational = true,
            Location = "Laundry room 2",
            ImageFK_ID = new Guid("b7e2a1c4-3f6a-4e2e-9b7a-2c8e1d4f5a6b") //Attaching/seeding the image to the specific machine through foreign key 
            });

            modelBuilder.Entity<ImageModel>().HasData( //seeding image PATH into the database. OBS!! Make sure the image already exist in ServerImages folder
                new ImageModel
                {
                    ImageId = new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    ImageDescription = "Siemen machine picture",
                    ImageName = "washing machine",
                    ImageExtension = ".jpg",
                    ImagePath = "https://localhost:7054/Images/Siemen.jpg",
                    ImageSizeInBytes = 337200
                },

                new ImageModel
                {
                    ImageId = new Guid("b7e2a1c4-3f6a-4e2e-9b7a-2c8e1d4f5a6b"),
                    ImageDescription ="Balay washing machine",
                    ImageName = "BalayMachine",
                    ImageExtension =".jpg",
                    ImagePath = "https://localhost:7054/Images/Balay.jpg",
                    ImageSizeInBytes = 380876
                }
                );

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Forbedring" },
                new Category { CategoryId = 2, CategoryName = "Vedlikehold" },
                new Category { CategoryId = 3, CategoryName = "Feil" },
                new Category { CategoryId = 4, CategoryName = "Annet" }
                );

            DateTime now = DateTime.Now; //variable for current date.

            modelBuilder.Entity<TimePeriodModel>().HasData( //setting a custom date that we want according to the time period
                new TimePeriodModel 
                { PeriodId = 1, 
                    Start = new DateTime(now.Year, now.Month, now.Day, 7, 0, 0), 
                    End = new DateTime(now.Year, now.Month, now.Day, 12, 0, 0) 
                },

                new TimePeriodModel
                { PeriodId = 2,
                Start = new DateTime(now.Year, now.Month, now.Day, 12, 0, 0),
                End = new DateTime(now.Year, now.Month, now.Day, 17, 0, 0)
                },

                new TimePeriodModel
                {
                    PeriodId = 3,
                    Start = new DateTime(now.Year, now.Month, now.Day, 17, 0, 0),
                    End = new DateTime(now.Year, now.Month, now.Day, 23, 0, 0)
                }
                
                );

        }

    }
}
