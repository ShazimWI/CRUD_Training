using CRUD_Training.ConnectionLayer;
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


        public IActionResult Customer()
        {
            return View();
        }
    }
}
