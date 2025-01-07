using System.ComponentModel.DataAnnotations.Schema;

namespace CRUD_Training.Models
{
    public class ProductModel
    {
        public int ProductID { get; set; }
        public required string ProductName { get; set; }
        public required int ProductPrice { get; set; }
        public required string ProductImg { get; set; } // Path to save in the database

        [NotMapped]
        public required IFormFile ProductImgFile { get; set; }  // For uploading the image
    }
}
