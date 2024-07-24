# Node.js Practical

## The task of the topic "Unit testing"

### Application
This application does CRUD operations with tour entity.  
The application consists of 
 - controller - tourController
 - model Tour
 - helper module - *utils/filtering* with function *filter* that is used by the controller.
  
### Tasks
Please write unit tests to check functionality of application's building blocks using Jest framework:
 - [x] tourController
 - [x] Tour
 - [x] filter function
  
 All testing modules should be placed into tests directory.   
 All test specifications should be real - it means that code like this 
 ```
 expect(2 + 2).toBe(4) 
 ```
 isn't good :)  
   
 Code coverage is calculated by Jest framework and should be at least 90% 
 (you can use command npm run coverage in this application to check coverage). 
   
 ### A pieces of advice
It is recommended to separate concerns while testing and to mock module's dependencies.  
Don't forget to test both positive and negative scenarios where needed.  
Try to use in-memory database (mongodb-memory-server) for some cases.    
  