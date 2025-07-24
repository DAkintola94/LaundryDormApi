using Microsoft.EntityFrameworkCore;
using LaundryDormApi.DataContext;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Identity;
using LaundryDormApi.Model.DomainModel;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Security.Cryptography.Xml;
using Serilog;


namespace LaundryDormApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            var logger = new LoggerConfiguration()
                .WriteTo.Console()
                .WriteTo.File("Logs/LaundryDorm_Log.txt", rollingInterval: RollingInterval.Day) //will create log to the path (Logs), folder we created
                .CreateLogger();

            builder.Logging.ClearProviders();
            builder.Logging.AddSerilog(logger);

            builder.Services.AddHttpClient();


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<ILaundrySession, LaundrySessionRepository>();
            builder.Services.AddScoped<IAdviceSetRepository, AdviceSetRepository>();
            builder.Services.AddScoped<IImageRepository, LocalImageRepository>();
            builder.Services.AddScoped<ITokenRepository, TokenRepository>();
            builder.Services.AddScoped<IUpdateCountRepository, UpdateCountRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            
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
                options.Password.RequireUppercase = false;
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
                        policyBuilder.WithOrigins("https://localhost:7054",
				"http://localhost:5174",
                "https://localhost5174",
                "http://localhost:5173",
                "https://localhost:5173",
                            "http://localhost:4200") //this makes it possible to listen to the live server in vscode
                                                                           //This setting makes it that the backend only listen to the frontend with this specific port/ip
                                                                           //During production, we set the address to the doamin name ("www.chess.com") feks
                                                                           //http: //127.0.0.1:5500

                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    });
            });


            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "LaundryDorm Api", Version = "v1" });
                options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme //telling Swagger that our API requires a security scheme, like a JWT Bearer token
                {
                    Name="Authorization",
                    In = ParameterLocation.Header, //Authorization to be passed as header
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = JwtBearerDefaults.AuthenticationScheme
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement //telling Swagger that our API requires a security scheme, like a JWT Bearer token
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = JwtBearerDefaults.AuthenticationScheme
                            },

                            Scheme = "Oauth2",
                            Name = JwtBearerDefaults.AuthenticationScheme,
                            In = ParameterLocation.Header
                        },
                         new List<string>()
                    }

                });

            });

            builder.Services.AddAuthorization(); //Enables authentication middleware, which processes incoming HTTP requests and sets properties like HttpContext.User.
                                                 // Middleware is like a chain of small programs that run before your controller gets the request, and often after the controller sends back a response.
                                                 

            var jwtKey = builder.Configuration["Jwt:Key"]; 
            // Configuration reads settings (like secrets or URLs) from outside the code, such as appsettings.json or environment variables

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
            })
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
                    (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new Exception("Jwt not configurated")))
                });


            var app = builder.Build();

            // Configure the HTTP request pipeline. 

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //Configuring Middleware
            // Middleware is like a chain of small programs that run before your controller gets the request, and often after the controller sends back a response.
            // Think of it as a set of steps your request goes through:
            // Checking authentication
            // Logging requests
            // Handling errors
            // Modifying requests or responses

            app.UseHttpsRedirection();

            app.UseStaticFiles(new StaticFileOptions //middleware that configure ASP.NET core to serve static files (image) from the ServerImages folder in project dir
                                                       //This makes any file placed in ServerImages folder to be access via a URL starting with /ServerImages
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "ServerImages")), //The folder we aim to serve
                RequestPath = "/ServerImages"
            });

            app.UseRouting();

            app.UseCors("MyAllowSpecificOrigins");

            app.UseAuthentication(); //middleware for extracting JWT from the Authorization header 
                                       //decodes the token, and pulls out the claims we added
                                       //stores them in HttpContext.User

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
