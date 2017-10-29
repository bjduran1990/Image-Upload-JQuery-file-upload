using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ImageFileUpload.Models
{
    public class Image : Base
    {
        [StringLength(150, ErrorMessage = "Image path cannot exceed 150 characters.")]
        public string ImagePath { get; set; }
        public bool IsDeleted { get; set; }
    }
}