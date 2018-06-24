using System.ComponentModel.DataAnnotations;

namespace Jwt.Issuer.Models.AccountViewModels
{
    public class ExternalLoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}