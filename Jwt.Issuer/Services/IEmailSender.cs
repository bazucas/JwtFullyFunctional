using System.Threading.Tasks;

namespace Security.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);

        Task SendEmailConfirmationAsync(string email, object callbackUrl);
    }
}