using System.ComponentModel.DataAnnotations;

namespace Jwt.Issuer.Models.AccountViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}