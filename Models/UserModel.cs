namespace CRUD_Training.Models
{
    public class UserModel
    {
        public int UserId { get; set; }
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public bool isActive { get; set; }
        public string? AddedBy { get; set; }
        public DateTime? AddedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
