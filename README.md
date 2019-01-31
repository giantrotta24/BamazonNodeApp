# BamazonNodeApp

In this activity, I created an Amazon-like storefront with access to a MySQL database.

First I started by creating a database that held mock data for an Amazon like storefront.

Using javascript I connected to the database and created a Customer application which gives the user the option to purchase my mock stock.
Purchases are tracked within the database and the database and product sales are accurately tracked. 


Then I created a manager application.
This application allows you to view your inventory, view any inventory that has fallen within a certain threshold (in this case less than 5 in stock), add stock to your inventory, and add new items to your inventory. 

Finally I created a supervisor application but was not able to finish it, below is pseudocode. 

### Pseudo-Code
Managed to properly display items in a table in the supervisor application but didn't get to the rest of the activity. 
My plan was to JOIN and GROUP BY the tables to by department and calculate the overhead costs of each department to display in a new table 
when the supervizor enters "View Product Sales by Department."

Also I would add a Create New Department function that would add a new Department to the department table while also adding the department as an option
within the products table. 

I did not include the logic to automaticalle add a new menu option as a customer when new departments were created although giving a departments
option wasn't part of the assignment, just something I wanted to include.

Finally, I was not able to finalize password validation but my goal was to give the Manager and Supervisor a four digit code that needed entered to access their applications.

## Here is a video of what LIRI can do

* [video link](https://drive.google.com/open?id=1lPMYoeUl7HlG227Y5YaY2pB4gBXNZ0PV)
* [drive folder link](https://drive.google.com/open?id=1mYUqiRUNfLfbetASjCji672jmaJhdAh9)


