using System.ComponentModel.DataAnnotations.Schema;

namespace CRUD_Training.Models
{
    public class ProductModel
    {
        public int ProductID { get; set; }
        public required string ProductName { get; set; }
        public required decimal Price { get; set; }
        public required string Descriptions { get; set; }
        public int Quantity { get; set; }
        public bool isActive { get; set; } = true;
        public required string ProductImg { get; set; } // Path to save in the database

        [NotMapped]
        public required IFormFile ProductImgFile { get; set; }  // For uploading the image
        public string? AddedBy { get; set; }
        public DateTime? AddedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
