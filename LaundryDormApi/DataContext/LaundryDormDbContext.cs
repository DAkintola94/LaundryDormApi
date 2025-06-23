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
        public DbSet<SessionPeriodModel> SessionReservation { get; set; }

        public DbSet<SessionServiceModel> SessionService { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //seeding primarykey
            modelBuilder.Entity<LaundryStatusState>().HasKey(x => x.LaundryStatusID);
            modelBuilder.Entity<MachineModel>().HasKey(x => x.MachineId);
            modelBuilder.Entity<MaintenanceLogModel>().HasKey(x => x.MaintenanceLogId);
            modelBuilder.Entity<AdviceSet>().HasKey(x => x.PosterId);
            modelBuilder.Entity<LaundrySession>().HasKey(x => x.LaundrySessionId);
            modelBuilder.Entity<ImageModel>().HasKey(x => x.ImageId);
            modelBuilder.Entity<SessionServiceModel>().HasKey(x => x.Id);


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
                .HasOne(sp => sp.SessionPeriod)
                .WithMany()
                .HasForeignKey(spk => spk.SessionPeriodId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MachineModel>()
                .HasOne(im => im.Image)
                .WithMany()
                .HasForeignKey(im => im.ImageFK_ID)
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

            //modelBuilder.Entity<MachineModel>().HasData( //seeding data, always seed when its something that will be permanent in the database/problem domain
            //new MachineModel {
            //MachineId = 1, MachineName = "Balay",
            //ModelName = "Random",
            //IsOperational = true,
            //Location = "Laundry room 1",
            //ImageFK_ID = new Guid ("08dd3e4e-9f82-4ada-8b37-2fb04b78b08b") //Attaching/seeding the image to the specific machine through foreign key 
            //},

            //new MachineModel {
            //MachineId = 2,
            //MachineName = "Samsung washing machine",
            //ModelName = "WW90CGC04DAH model",
            //IsOperational = true,
            //Location = "Laundry room 2",
            //ImageFK_ID = new Guid("08dd3e4e-b027-40cf-8a90-8803586722a5") //Attaching/seeding the image to the specific machine through foreign key 
            //});

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Forbedring" },
                new Category { CategoryId = 2, CategoryName = "Vedlikehold" },
                new Category { CategoryId = 3, CategoryName = "Feil" },
                new Category { CategoryId = 4, CategoryName = "Annet" }
                );

            modelBuilder.Entity<SessionPeriodModel>().HasData(
                new SessionPeriodModel { PeriodId = 1, PeriodTitle = "07:00 - 12:00" },
                new SessionPeriodModel { PeriodId = 2, PeriodTitle = "12:00 - 17:00" },
                new SessionPeriodModel { PeriodId = 3, PeriodTitle = "17:00 - 22:00" }
                );

        }

    }
}
