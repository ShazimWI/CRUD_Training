using System.Data;
using CRUD_Training.ConnectionLayer;
using CRUD_Training.Models;
using Microsoft.AspNetCore.Mvc;

namespace CRUD_Training.Controllers
{
    public class ProductsController : Controller
    {
        private readonly cDAL _dal;

        public ProductsController(cDAL dal)
        {
            _dal = dal;
        }

        // This code block is from the time when we dont have an Image Entity in our table
        //[HttpPost]
        //public IActionResult InsertProduct([FromBody] ProductModel product)
        //{
        //    //Reference variable
        //    var columnValues = new Dictionary<string, object>
        //    {
        //        {"ProductName", product.ProductName },
        //        {"ProductPrice", product.ProductPrice }
        //    };
        //    //Executing query
        //    int rowsCount = _dal.Insert("Products", columnValues);
        //    if (rowsCount > 0)
        //    {
        //        return Json(new { success = true, message = "Product Added!!" });
        //        //TempData["Message"] = "Customer added successfully";
        //    }
        //    else
        //    {
        //        return Json(new { success = false, message = "Failed to add product" });
        //        //TempData["Message"] = "Failed to add Customer";
        //    }
        //    //return RedirectToAction("Index");
        //}

        [HttpPost]
        public IActionResult InsertProduct([FromForm] ProductModel product)
        {
            //---------Validate the uploaded file------------
            if (product.ProductImgFile == null)
            {
                return Json(new { success = false, message = "Please upload an image. " });
            }

            //-----------Check for valid file type------------
            string[] allowedExtensions = { ".jpg", ".png", ".jpeg" };
            string fileExtension = Path.GetExtension(product.ProductImgFile.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return Json(new { success = false, message = "Invalid file type, Only jpg, jpeg, png are allowed. " });
            }

            // ------------ Save the file to the "Images" folder
            string fileName = Guid.NewGuid().ToString() + fileExtension; //This Generate a unique file name
            string imagePath = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot", "Images", fileName);

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                product.ProductImgFile.CopyTo(stream); // Save the file to the server
            }

            //-------------Reference variable------------
            var columnValues = new Dictionary<string, object>
            {
                {"ProductName", product.ProductName },
                {"ProductPrice", product.ProductPrice },
                {"ProductImg", "/Images/" + fileName }
            };

            //--------Executing query-------------
            int rowsCount = _dal.Insert("Products", columnValues);

            if (rowsCount > 0)
            {
                Console.WriteLine($"Message: {Json(new { success = true, message = "Product Added!!" })}");
                return Json(new { success = true, message = "Product Added!!" });
            }
            else
            {
                return Json(new { success = false, message = "Failed to add product" });
            }
        }

        [HttpGet]
        public JsonResult GetProducts()
        {
            // Use the generic GetData method to fetch data
            var products = _dal.GetData<ProductModel>("Products");

            return Json(new { data = products}); // Wrap data in a "data" key for DataTables
        }

        [HttpPost]
        public IActionResult UpdateProduct([FromForm] ProductModel product, [FromForm] IFormFile ProductImgFile)
        {
            if (product == null)
            {
                throw new ArgumentNullException("Product is null. Check the incoming data.");
            }

            //Fetch All Products from the Database then Filter for the Specific Product (i.e; product id)
            var currentProduct = _dal.GetData<ProductModel>("Products").FirstOrDefault(p => p.ProductID == product.ProductID);

            if (currentProduct == null)
            {
                return Json(new { success = false, message = "Product not found!" });
            }

            string fileName = currentProduct.ProductImg; // Use existing image name if no new file is uploaded.

            if (ProductImgFile != null && ProductImgFile.Length > 0)
            {
                // Validate file type
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png" };
                string fileExtension = Path.GetExtension(ProductImgFile.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return Json(new { success = false, message = "Invalid file type. Only .jpg, .jpeg, and .png are allowed." });
                }

                // Delete the existing image if it exists
                if (!string.IsNullOrWhiteSpace(fileName))
                {
                    string existingImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", fileName.TrimStart('/'));
                    if (System.IO.File.Exists(existingImagePath))
                    {
                        System.IO.File.Delete(existingImagePath);
                    }
                }

                // Generate a unique file name and save it
                fileName = Guid.NewGuid().ToString() + fileExtension;
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    ProductImgFile.CopyTo(stream);
                }

                // Save relative path for database
                fileName = "/Images/" + fileName;
            }

            // Update column values
            var columnValues = new Dictionary<string, object>
            {
                {"ProductName", product.ProductName },
                {"ProductPrice", product.ProductPrice },
                {"ProductImg", fileName }
            };

            string condition = $"ProductID = {product.ProductID}";

            // Update the database
            int rowsUpdated = _dal.Update("Products", columnValues, condition);

            if (rowsUpdated > 0)
            {
                return Json(new { success = true, message = "Product updated successfully!" });
            }
            else
            {
                return Json(new { success = false, message = "Failed to update product!" });
            }
        }


        [HttpPost]
        public IActionResult DeleteProduct(int id)
        {
            if (id <= 0)
            {
                return Json(new { success = false, message = "Invalid product ID." });
            }

            try
            {
                // Fetch the product's image path
                var product = _dal.GetData<ProductModel>("Products").FirstOrDefault(p => p.ProductID == id);

                if (product == null)
                {
                    return Json(new { success = false, message = "Product not found." });
                }

                string imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.ProductImg.TrimStart('/'));

                // Delete the product from the database
                string condition = $"ProductID = {id}";
                int rowsDeleted = _dal.Delete("Products", condition);

                if (rowsDeleted > 0)
                {
                    // Delete the image file
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }

                    return Json(new { success = true, message = "Product deleted successfully!" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to delete product from database." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting product: {ex.Message}");
                return Json(new { success = false, message = "An error occurred while deleting the product." });
            }
        }


        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

    }

}
