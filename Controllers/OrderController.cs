using CRUD_Training.ConnectionLayer;
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
        public IActionResult Order()
        {
            return View();
        }
    }
}
