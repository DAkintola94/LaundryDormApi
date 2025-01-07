namespace LaundryDormApi.Model.ViewModel
{
    public class MachineViewModel
    {
        public int MachineId { get; set; }
        public string MachineName { get; set; }
        public string ModelName { get; set; }
        public bool IsOperational { get; set; }
        public string Location { get; set; }

    }
}
