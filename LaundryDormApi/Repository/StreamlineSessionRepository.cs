using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using System.Threading;

namespace LaundryDormApi.Repository
{
    public class StreamlineSessionRepository : IStreamlineSession
    {
        private readonly LaundrySessionRepository _laundrySession;
        private readonly IUpdateCountRepository _updateCountRepository;
        private readonly ILogger<StreamlineSessionRepository> _logger; // Add logger

        public StreamlineSessionRepository(LaundrySessionRepository laundrySession, IUpdateCountRepository updateCountRepository,
            ILogger<StreamlineSessionRepository> logger
            )
        {
            _laundrySession = laundrySession;
            _updateCountRepository = updateCountRepository;
            _logger = logger; // Initialize logger
        }

        public async Task<int> UpdateSession(CancellationToken cancellationToken)
        {
            int? updateCount = (await _updateCountRepository.GetCountNumber()) ?? 0;

            DateTime today = DateTime.Today; //local-day, date, day
            DateTime now = DateTime.UtcNow; //local-time, date, day, minute

            var getLaundrySessions = await _laundrySession.GetAllSession(null, null, null, null, null, true, cancellationToken, 1, int.MaxValue);

            int updatedSessions = 0;

            try
            {
                if (getLaundrySessions != null)
                {
                    var sessionPeriods = getLaundrySessions.Where(x //.Where to get the conditions as list, so we can work with id (FK in this case) and other values
                    => x.TimePeriod != null
                    && x.LaundrySessionEndTime < now // checking if the start time & end time is today, or before today (past time from the database)
                    && x.LaundryStatusID == 1 //checking if laundry status from db is active
                    ).ToList();

                    foreach (var sessionToUpdate in sessionPeriods)
                    {
                        if (sessionToUpdate.LaundrySessionEndTime < now) //We need loop to loop through the list to set the matching condition to 2, one by one
                        {
                            sessionToUpdate.LaundryStatusID = 2;
                            await _laundrySession.UpdateSession(sessionToUpdate, cancellationToken);

                            updateCount++;
                            await _updateCountRepository.UpdateCount(updateCount);
                            updatedSessions++;
                        }
                    }
                }
                _logger.LogInformation("Successfully update {Count} expired laundry session. ", updateCount);
            }
            catch (Exception err)
            {
                _logger.LogError($"An error occurred while trying to finalize expired laundry sessions {err}");
            }
            return updatedSessions;
        }





    }
}
