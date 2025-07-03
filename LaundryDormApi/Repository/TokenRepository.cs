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
            var claims = new List<Claim> //claims are the information that we want to store about the user, in the token that is being sent to the client
            {
                new Claim (ClaimTypes.Email, applicationUser.Email ?? string.Empty),
                new Claim (ClaimTypes.MobilePhone, applicationUser.PhoneNumber ?? string.Empty),
                new Claim (ClaimTypes.Name, $"{applicationUser.FirstName} {applicationUser.LastName}" ?? string.Empty),
                new Claim (ClaimTypes.NameIdentifier, applicationUser.Id ?? string.Empty)
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
