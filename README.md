Issues:

The authentication issue was AuthDbContext
Changing it from int to guid fixed it, but im not sure

Tips:

Authentication and Authorization middleware help identify who the user is and what they’re allowed to do.

Once a user logs in, this middleware adds their information into http.Context.User. This makes it easy for the rest of your application to access details about the logged-in user, like their name, role, or ID, using something called claims.

var currentUser = _userManager.GetUserAsync(User); 
To get users information


Tips: 

Instead of dropping database when you make a new column in the model, just write the line 

Add-Migration AddInspectedByAdminToAdviceSet
- Context “nameOfTheDbContextIfNeeded”

Ef core tracks all changes to your model? Not just the specific line you added.

Then

Update-Database
- Context “nameOfTheDbContextIfNeeded”

Do the same when you remove a column, just write RemoveColumnName

How to run the application
