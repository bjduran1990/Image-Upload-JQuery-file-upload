using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ImageFileUpload.Models;
using System.Web.Helpers;

namespace ImageFileUpload.Controllers
{
    public class ImageController : Controller
    {
        ImageContext context = new ImageContext();
        // GET: Image
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadImage(HttpPostedFileBase file,Image image, string command)
        {
            string tempFolder = Server.MapPath("~/tempFolder/");
            if (command == "Create")
            {
                var files = Directory.GetFiles(tempFolder);
                string fileName = Path.GetFileName(files[0]);
                string filePath = Path.Combine(ConfigurationManager.AppSettings["UploadPath"],fileName);
                image.ImagePath = filePath;
                image.IsDeleted = false;
                context.Images.Add(image);
                context.SaveChanges();


                System.IO.File.Copy(Path.Combine(tempFolder, fileName), Server.MapPath(filePath),true);
                Directory.Delete(tempFolder,true);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                if (file != null && file.ContentLength > 0)
                {

                    string fileName = Path.GetFileName(file.FileName);
              
                    if (!Directory.Exists(tempFolder))
                    {
                        Directory.CreateDirectory(tempFolder);
                    }

                    string path = Path.Combine(tempFolder, fileName);
                    file.SaveAs(path);


                }
                return View("Index");
            }



        }

        public ActionResult Details(int? id)
        {
            Image image = context.Images.Where(i => i.Id == id).FirstOrDefault();
            string imagePath = Server.MapPath("~/Images/No-image-available.jpg");
            if (image != null)
            {
                if (System.IO.File.Exists(Server.MapPath(image.ImagePath)))
                {
                    imagePath = Server.MapPath(image.ImagePath);
                }

            }
            using (System.Drawing.Image img = System.Drawing.Image.FromFile(imagePath))
            {
                using (MemoryStream m = new MemoryStream())
                {
                    img.Save(m, img.RawFormat);
                    byte[] imageBytes = m.ToArray();

                    // Convert byte[] to Base64 String
                    string base64String = "data:image/jpeg;base64," + Convert.ToBase64String(imageBytes);
                    ViewBag.ImageUrl = base64String;
                }
            }

            return View("Details", image);

            
        }
    }
}