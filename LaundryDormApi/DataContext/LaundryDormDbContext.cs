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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //seeding primarykey
            modelBuilder.Entity<LaundryStatusState>().HasKey(x => x.LaundryStatusID);
            modelBuilder.Entity<MachineModel>().HasKey(x => x.MachineId);
            modelBuilder.Entity<MaintenanceLogModel>().HasKey(x => x.MaintenanceLogId);
            modelBuilder.Entity<AdviceSet>().HasKey(x => x.PosterId);
            modelBuilder.Entity<LaundrySession>().HasKey(x => x.LaundrySessionId);
            modelBuilder.Entity<ImageModel>().HasKey(x => x.ImageId);


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

            modelBuilder.Entity<MaintenanceLogModel>()
                .HasOne(ml => ml.Machine)
                .WithMany()
                .HasForeignKey(ml => ml.MachineId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AdviceSet>()
                .HasOne(ad => ad.CategoryModel)
                .WithMany()
                .HasForeignKey(ad => ad.CategoryID)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<LaundryStatusState>().HasData( //seeding data, always seed when its something that should be permanent in the database/problem domain
               new LaundryStatusState { LaundryStatusID = 1, StatusDescription = "Pågår" },
               new LaundryStatusState { LaundryStatusID = 2, StatusDescription = "Ferdig" },
               new LaundryStatusState { LaundryStatusID = 3, StatusDescription = "Stoppet!" },
               new LaundryStatusState { LaundryStatusID = 4, StatusDescription = "Service pågår!" }
           );

            modelBuilder.Entity<MachineModel>().HasData( //seeding data, always seed when its something that will be permanent in the database/problem domain
            new MachineModel { MachineId = 1, MachineName = "Bosch", ModelName = "WAE24460", IsOperational = true, Location = "Laundry room 1" },
                new MachineModel { MachineId = 2, MachineName = "Miele", ModelName = "WDB 030 WCS", IsOperational = true, Location = "Laundry room 1" },
                new MachineModel { MachineId = 3, MachineName = "Siemens", ModelName = "WM14N200DN", IsOperational = true, Location = "Laundry room 2" },
            new MachineModel { MachineId = 4, MachineName = "Electrolux", ModelName = "EW6F5247G5", IsOperational = true, Location = "Laundry room 2" });

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Forbedring" },
                new Category { CategoryId = 2, CategoryName = "Vedlikehold" },
                new Category { CategoryId = 3, CategoryName = "Feil" },
                new Category { CategoryId = 4, CategoryName = "Annet" }
                );
        }

    }
}
