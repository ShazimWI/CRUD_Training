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

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login( UserModel user)
        {
            if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrWhiteSpace(user.Password))
            {
                ViewBag.ErrorMessage = "Username and password are required";
                return View();
            }

            //Verify Credentials
            var existingUser = _dal.GetData<UserModel>("Users").FirstOrDefault(u => u.UserName == user.UserName );

            if (existingUser == null || existingUser.Password != user.Password)
            {
                ViewBag.ErrorMessage = "Invalid username or password";
                return View();
            }

            //Save User Session
            HttpContext.Session.SetString("Username", existingUser.UserName);
            Console.WriteLine($"Checking username value: {existingUser.UserName}");

            return RedirectToAction("Index", "Home");

        }

        

        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); //clearing the session values
            return RedirectToAction("Login", "Login");
        }
    }
}
