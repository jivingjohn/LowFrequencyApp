# LowFrequencyApp
Find sentences containing low frequency words in Wikipedia Articles

What it's for:
Language Teachers need to be able to provide meaningful content to students
They often use Wikipedia to find content that includes words they are teaching
This is time-consuming, so this is a way of making this a bit easier

Todo:

Initial todo list

Add your own words
Spacing at bottom of other pages - Add an hr
Add footer with wikipedia acknowledgement
Make Navigation links easier to press - layout
Get images from Wikipedia
Remove empty lists button - JQuery
Better searching of words - use match and regex for either space either side, or start / end of sentence either side

To use:

Basically, you give it some search criteria for a title 
(otherwise you need to know the actual title to get a Wikipedia article back)
It will return titles that match using Wikipedia search api
It then enumerates how many of each word exist within that article
And produces a list of sentences containing each word

To install:

Install Node for target operating system
Install MongoDB for target operating system
Copy the folder structure
cd into directory
rm -r node_modules folder
npm install
