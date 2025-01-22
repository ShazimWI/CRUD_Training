namespace CRUD_Training.Models
{
    public class CustomerModel
    {
        public int CustomerID { get; set; }
        public required string FirstName{ get; set; }
        public required string LastName{ get; set; }
        public string? FullName{ get; set; }
        public required string Email{ get; set; }
        public string? PhoneNumber{ get; set; }
        public string? Address{ get; set; }
        public string? City{ get; set; }
        public string? Country{ get; set; }
        public bool IsActive { get; set; } = true;

        public string? AddedBy { get; set; }
        public DateTime? AddedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }

    }
}
