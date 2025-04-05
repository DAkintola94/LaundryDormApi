Issues:

The authentication issue was AuthDbContext
Changing it like this fixed it

base.OnModelCreating(modelBuilder);

    var sysAdminRoleId = "67330e4f-e3e7-470f-9230-124bb2f207e9";
       var adminRoleId = "76e267ae-8be5-4040-b507-e39da47afba1";
        var userRoleId = "da325b16-0977-43ca-8611-b32033c9ff91";

//Seed roles for (User, Admin Superadmin)
// Seed superAdmin
// Add all the role to the superadmin

var roles = new List<IdentityRole> //List of roles, stacked in IdenityRole list
{

       new IdentityRole //role 1
       {
          Id = sysAdminRoleId,
          ConcurrencyStamp = sysAdminRoleId,
          Name = "Sysadmin",
          NormalizedName = "Sysadmin".ToUpper()
       },

       new IdentityRole //role 2
       {
           Id = adminRoleId,
           ConcurrencyStamp = adminRoleId,
           Name = "Admin",
           NormalizedName = "Admin".ToUpper()
       },

       new IdentityRole //role 3
       {
           Id = userRoleId,
           ConcurrencyStamp = userRoleId,
           Name = "Regularuser",
           NormalizedName = "Regularuser".ToUpper()
       },

     };

modelBuilder.Entity<IdentityRole>().HasData(roles);
