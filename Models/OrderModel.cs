namespace CRUD_Training.Models
{
    public class OrderModel
    {
        public int OrderNO { get; set; }
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public required DateTime OrderDate { get; set; }
        public required decimal TotalAmount { get; set; }
        public bool IsActive { get; set; } = true;
        public string? AddedBy { get; set; }
        public DateTime? AddedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    //will change later
    public class OrderWithDetailsModel
    {
        public int OrderNO { get; set; }
        public string CustomerName { get; set; }
        public string ProductName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string AddedBy { get; set; }
        public DateTime AddedOn { get; set; }
    }

}
