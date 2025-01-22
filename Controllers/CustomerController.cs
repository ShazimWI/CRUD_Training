using CRUD_Training.ConnectionLayer;
using CRUD_Training.Models;
using Microsoft.AspNetCore.Mvc;

namespace CRUD_Training.Controllers
{
    public class CustomerController : Controller
    {
        private readonly cDAL _dal;

        public CustomerController(cDAL dal)
        {
            _dal = dal;
        }

        [HttpGet]
        public IActionResult GetCustomers()
        {
            var customers = _dal.GetData<CustomerModel>("Customers");

            return Json(new { data = customers });
        }

        [HttpPost]
        public IActionResult InsertCustomer([FromBody] CustomerModel customer)
        {
            var columnValues = new Dictionary<string, object>
            {
                {"FirstName", customer.FirstName },
                {"LastName", customer.LastName },
                {"Email", customer.Email},
                {"PhoneNumber", customer.PhoneNumber},
                {"Address", customer.Address},
                {"City", customer.City},
                {"Country", customer.Country},
                {"AddedBy", "shazim"},
                {"AddedOn", DateTime.Now},
                {"isActive", customer.IsActive},
            };

            int rowsCount = _dal.Insert("Customers", columnValues);

            if (rowsCount > 0)
            {
                return Json(new { success = true, message = "Customer Added!!" });
            }
            else
            {
                return Json(new { success = false, message = "Failed to add customer." });
            }
        }

        [HttpPost]
        public IActionResult UpdateCustomer([FromBody] CustomerModel customer)
        {
            if (customer == null)
            {
                throw new ArgumentNullException("Customer is null. Check the incoming data.");
            }

            //Fetch All Customers from the Database then Filter for the Specific Customer (i.e; customer id)
            var currentCustomer = _dal.GetData<CustomerModel>("Customers").FirstOrDefault(c => c.CustomerID == customer.CustomerID);

            if (currentCustomer == null)
            {
                return Json(new { success = false, message = "Customer not found!" });
            }

            var columnValues = new Dictionary<string, object>
            {
                {"FirstName", customer.FirstName },
                {"LastName", customer.LastName },
                {"Email", customer.Email},
                {"PhoneNumber", customer.PhoneNumber},
                {"Address", customer.Address},
                {"City", customer.City},
                {"Country", customer.Country},
                {"UpdatedBy", "shazim"},
                {"UpdatedOn", DateTime.Now},
                {"isActive", customer.IsActive},
            };

            string condition = $"CustomerID = {customer.CustomerID}";

            // Update the database
            int rowsUpdated = _dal.Update("Customers", columnValues, condition);

            if (rowsUpdated > 0)
            {
                return Json(new { success = true, message = "Customer updated successfully!" });
            }
            else
            {
                return Json(new { success = false, message = "Failed to update customer!" });
            }
        }

        [HttpPost]
        public IActionResult DeleteCustomer(int id)
        {
            if (id <= 0)
            {
                return Json(new { success = false, message = "Invalid customer ID." });
            }

            try
            {
                // Fetch the customer's image path
                var customer = _dal.GetData<CustomerModel>("Customers").FirstOrDefault(c => c.CustomerID == id);

                if (customer == null)
                {
                    return Json(new { success = false, message = "Customer not found." });
                }


                // Delete the customer from the database
                string condition = $"CustomerID = {id}";
                int rowsDeleted = _dal.Delete("Customers", condition);

                if (rowsDeleted > 0)
                {
                    return Json(new { success = true, message = "Customer deleted successfully!" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to delete customer from database." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting customer: {ex.Message}");
                return Json(new { success = false, message = "An error occurred while deleting the customer." });
            }
        }


        public IActionResult Customer()
        {
            if (string.IsNullOrWhiteSpace(HttpContext.Session.GetString("Username")))
            {
                return RedirectToAction("login", "Login");
            }

            return View();
        }


    }
}
