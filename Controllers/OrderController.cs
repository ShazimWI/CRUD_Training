using System.Data.SqlClient;
using CRUD_Training.ConnectionLayer;
using CRUD_Training.Models;
using Microsoft.AspNetCore.Mvc;

namespace CRUD_Training.Controllers
{
    public class OrderController : Controller
    {
        private readonly cDAL _dal;

        public OrderController(cDAL dal)
        {
            _dal = dal;
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            var orders = _dal.GetOrdersWithDetails();

            return Json(new { data = orders });
        }

        //[HttpPost]
        //public IActionResult InsertOrder([FromBody] OrderModel order)
        //{
        //    var columnValues = new Dictionary<string, object>
        //    {
        //        {"CustomerID", order.CustomerID },
        //        {"ProductID", order.ProductID},
        //        {"OrderDate", order.OrderDate },
        //        {"TotalAmount", order.TotalAmount},
        //        {"isActive", order.IsActive},
        //        {"AddedBy", "shazim"},
        //        {"AddedOn", DateTime.Now},
        //    };

        //    int rowsCount = _dal.Insert("Orders", columnValues);

        //    if(rowsCount > 0)
        //    {
        //        return Json(new { success = true, message = "Order Added!!" });
        //    }
        //    else
        //    {
        //        return Json(new { success = false, message = "Failed to add order." });
        //    }
        //}

        [HttpPost]
        public IActionResult InsertOrder([FromBody] OrderModel order)
        {
            if (order == null)
            {
                return Json(new { success = false, message = "Invalid order data." });
            }

            try
            {
                // Define both the order insert and product quantity update commands
                var commands = new List<(string query, Dictionary<string, object> parameters)>
                {
                    // Insert into Orders table
                    (
                        query: @"
                            INSERT INTO Orders (CustomerID, ProductID, OrderDate, TotalAmount, isActive, AddedBy, AddedOn)
                            VALUES (@CustomerID, @ProductID, @OrderDate, @TotalAmount, @isActive, @AddedBy, @AddedOn)",
                        parameters: new Dictionary<string, object>
                        {
                            { "@CustomerID", order.CustomerID },
                            { "@ProductID", order.ProductID },
                            { "@OrderDate", order.OrderDate },
                            { "@TotalAmount", order.TotalAmount },
                            //{ "@Quantity", order.Quantity },
                            { "@isActive", order.IsActive },
                            { "@AddedBy", "shazim" },
                            { "@AddedOn", DateTime.Now }
                        }
                    ),
                    // Update product quantity
                    (
                        query: @"
                            UPDATE Products
                            SET Quantity = Quantity - @OrderedQuantity
                            WHERE ProductID = @ProductID AND Quantity >= @OrderedQuantity",
                        parameters: new Dictionary<string, object>
                        {
                            { "@OrderedQuantity", order.Quantity },
                            { "@ProductID", order.ProductID }
                        }
                    )
                };

                // Execute the transaction
                bool result = _dal.ExecuteTransaction(commands);

                if (result)
                {
                    return Json(new { success = true, message = "Order placed successfully!" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to place order." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        [HttpPost]
        public IActionResult DeleteOrder(int id)
        {
            if (id <= 0)
            {
                return Json(new { success = false, message = "Invalid order number." });
            }

            try
            {
                var order = _dal.GetData<OrderModel>("Orders").FirstOrDefault(o => o.OrderNO == id);

                if (order == null)
                {
                    return Json(new { success = false, message = "Order not found." });
                }


                // Delete the order from the database
                string condition = $"OrderNO = {id}";
                int rowsDeleted = _dal.Delete("Orders", condition);

                if (rowsDeleted > 0)
                {
                    return Json(new { success = true, message = "Order deleted successfully!" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to delete order from database." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting order: {ex.Message}");
                return Json(new { success = false, message = "An error occurred while deleting the order." });
            }
        }

        public IActionResult Order()
        {
            return View();
        }
    }
}
