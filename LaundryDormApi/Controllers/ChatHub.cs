using Microsoft.AspNetCore.SignalR;

namespace LaundryDormApi.Controllers
{
    public class ChatHub : Hub
    {

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceivedMessage", user, message);
        }
    }
}
