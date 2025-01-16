namespace LaundryDormApi.Model.DomainModel
{
    public class MachineModel
    {
        public int MachineId { get; set; }
        public string? MachineName { get; set; }
        public string? ModelName { get; set; }
        public bool IsOperational { get; set; }
        public string? Location { get; set; }
        public ImageModel? Image { get; set; }
        public Guid ImageFK_ID { get; set; }

    }
}
