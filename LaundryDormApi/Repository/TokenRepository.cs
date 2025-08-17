using LaundryDormApi.Model.DomainModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims; 
using System.Text;

namespace LaundryDormApi.Repository
{
    public class TokenRepository : ITokenRepository
    {
        private readonly IConfiguration _configuration;
       
        public TokenRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

       public string CreateJWTToken(ApplicationUser applicationUser, List<string> roles)
        {
            //applicationUser variable (subclass of IdentityUser) is responsible for extracting all user information retrieved from the database. 

            var claims = new List<Claim> //claim objects are used to package bits of users information into a format that the JWT can understand.
            {
                new Claim (ClaimTypes.Email, applicationUser.Email ?? string.Empty), 
                new Claim (ClaimTypes.MobilePhone, applicationUser.PhoneNumber ?? string.Empty),
                new Claim (ClaimTypes.Name, $"{applicationUser.FirstName} {applicationUser.LastName}" ?? string.Empty),
                new Claim (ClaimTypes.NameIdentifier, applicationUser.Id ?? string.Empty),
                new Claim (ClaimTypes.Uri, applicationUser.ProfilePictureUrlPath ?? string.Empty) //serving the image path of the file from server
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

           
            var encodeKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new Exception("Key not found")));

            var creds = new SigningCredentials(encodeKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(120), //token expires after 120 minutes
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
