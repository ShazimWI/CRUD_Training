using CRUD_Training.ConnectionLayer;
using CRUD_Training.Models;
using Microsoft.AspNetCore.Mvc;

namespace CRUD_Training.Controllers
{
    public class LoginController : Controller
    {
        private readonly cDAL _dal;

        public LoginController(cDAL dal)
        {
            _dal = dal;
        }

        [HttpPost]
        public IActionResult LoginUser(UserModel user)
        {
            if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrWhiteSpace(user.Password))
            {
                ViewBag.ErrorMessage = "Username and password are required";
                return View();
            }

            //Verify Credentials
            var existingUser = _dal.GetData<UserModel>("Users").FirstOrDefault(u => u.UserName == user.UserName && u.isActive);

            if (existingUser == null || existingUser.Password != user.Password)
            {
                ViewBag.ErrorMessage = "Invalid username or password";
                return View();
            }

            //Save User Session
            HttpContext.Session.SetString("Username", existingUser.UserName);

            return RedirectToAction("Index", "Products");

        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Logout()
        {
            return RedirectToAction("Login");
        }
    }
}
