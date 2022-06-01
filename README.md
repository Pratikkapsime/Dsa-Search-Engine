
# Dsa-Search-Engine

This project is about data structure and algorithem based Seach Engine. This project mainly has four parts:-

* Web Scrapping
* Tf-idf calculation
* Saving extrated and calculated data to MongoDb sever
* finally Express js for building web application. 

### How to Install and Run the Project locally 
Use web Scrapping.py file to scrape the data from difftent websites. I have used Leetcode for creating my database. If you want to use some different websites such as codechef, hackerrank, codeforces etc than you to inspect that webpage and have to find which Html tag contains the problem title, urs and problem description. Now using python and its libraies such as Beautiful soup, selenium to scrape the required data and save it locally.

Than use tf_idf.py for extrating all keyword from our corpus by using nltk library of python which allow use to filter stopwords. And then calculate Term frequency(tf) and inverse document frequency(idf) for each documents. After that generate a matrix of tf_idf values and save all these file as all_keywords.txt, tf_idf_matrix.txt and idf.txt. 

Now use server.js file to save all the locally stored data to MongoDb server. For using MongoDb you have to create a folder name modles which contains schemas and modle of different modles we want to strore to the server.


