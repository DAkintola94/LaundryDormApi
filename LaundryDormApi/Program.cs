using Microsoft.EntityFrameworkCore;
using LaundryDormApi.DataContext;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Identity;
using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<ILaundrySession, LaundrySessionRepository>();
            builder.Services.AddScoped<IMachineLogRepository, MachineLogRepository>();
            builder.Services.AddScoped<IAdviceSetRepository, AdviceSetRepository>();
            builder.Services.AddScoped<IImageRepository, LocalImageRepository>();

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddDbContext<ApplicationDbContext>(options => 
            options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
            new MySqlServerVersion(new Version(11, 5, 2))
            ));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: "MyAllowSpecificOrigins",
                    policyBuilder =>
                    {
                        policyBuilder.WithOrigins("http://127.0.0.1:5500") //this makes it possible to listen to the live server in vscode
                                                                           //This setting makes it that the backend only listen to the frontend with this specific port/ip
                                                                           //During production, we set the address to the doamin name ("www.chess.com") feks
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    });
            });


            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("MyAllowSpecificOrigins");

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
