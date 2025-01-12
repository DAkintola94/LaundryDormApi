using Microsoft.EntityFrameworkCore;
using LaundryDormApi.DataContext;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Identity;
using LaundryDormApi.Model.DomainModel;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
            builder.Services.AddScoped<ITokenRepository, TokenRepository>();
            
            builder.Services.AddIdentityCore<ApplicationUser>()
                .AddRoles<IdentityRole>()
                .AddTokenProvider<DataProtectorTokenProvider<ApplicationUser>>("LaundryDormApi")
                .AddEntityFrameworkStores<LaundryDormAuthContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>();

            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 4;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 200;
                options.Lockout.AllowedForNewUsers = true;
            });


            builder.Services.AddDbContext<LaundryDormDbContext>(options =>
          options.UseMySql(builder.Configuration.GetConnectionString("DbContextConnection"),
          new MySqlServerVersion(new Version(11, 5, 2))
          ));

            builder.Services.AddDbContext<LaundryDormAuthContext>(options => 
            options.UseMySql(builder.Configuration.GetConnectionString("AuthContextConnection"),
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

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                });
                

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

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "ServerImages")),
                RequestPath = "/ServerImages"
            });

            app.MapControllers();

            app.Run();
        }
    }
}
