using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GitHubRepositorySearch.Models
{
    // Represents the search result item
    public class RepositoryItem
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public Owner Owner { get; set; }
    }

    public class Owner
    {
        public string Avatar_Url { get; set; }
    }
}