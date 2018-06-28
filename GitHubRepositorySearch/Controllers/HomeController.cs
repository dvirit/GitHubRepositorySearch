using GitHubRepositorySearch.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GitHubRepositorySearch.Controllers
{
    public class HomeController : Controller
    {
        // Search page
        public ActionResult Index()
        {
            return View();
        }

        // Post: Adds a new bookmark to session
        [HttpPost]
        public void SaveBookmark(string itemId, string bookmarkItem)
        {
            // Creates the bookmarks dictionary if it doesn't exist (I chose a dictionary because I want to overwrite if an item already exists)
            if (Session["bookmarks"] == null)
                Session["bookmarks"] = new Dictionary<string, string>();

            // Saves the dictionary as a strongly typed object
            var bookmarks = Session["bookmarks"] as Dictionary<string, string>;

            // Adds the new bookmark full Json result string to the bookmarks dictionary
            bookmarks[itemId] = bookmarkItem.ToString();
        }

        // Saved bookmarks page
        public ActionResult Bookmarks()
        {
            // Checks if the dictionary of bookmarks exists in the session, returns an empty list otherwise
            if (Session["bookmarks"] == null)
                return View(new List<RepositoryItem>());

            // loads bookmarks from session
            var sessionBookmarks = Session["bookmarks"] as Dictionary<string, string>;

            var bookmarksItems = new List<RepositoryItem>();

            // Converts saved bookmarks from Json to RepositoryItem object and saves in the new bookmarksItems list
            foreach (var item in sessionBookmarks)
            {
                // converts saved Json bookmarks to objects.
                var currentItem = Newtonsoft.Json.JsonConvert.DeserializeObject<RepositoryItem>(item.Value);
                // Note: Full results are saved in the session as Json but I only load the id, name and avatar url. To load additional fields just add properties to the 'RepositoryItem' class

                bookmarksItems.Add(currentItem);
            }

            // returns the list of bookmarks
            return View(bookmarksItems);
        }
    }
}

