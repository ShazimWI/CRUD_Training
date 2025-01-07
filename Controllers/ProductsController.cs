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
                //TempData["Message"] = "Customer added successfully";
            }
            else
            {
                return Json(new { success = false, message = "Failed to add product" });
                //TempData["Message"] = "Failed to add Customer";
            }

            //return RedirectToAction("Index");
        }

        [HttpGet]
        public JsonResult GetProducts()
        {
            // Use the generic GetData method to fetch data
            var products = _dal.GetData<ProductModel>("Products");

            return Json(new { data = products}); // Wrap data in a "data" key for DataTables
        }


        [HttpGet]
        public IActionResult Index()
        {
            //var data = _dal.GetData<ProductModel>("Products");
            return View();
        }

    }

}
