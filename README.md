# QMT
Qualtrics Mouse-Tracking

In this respository, we currently provide a downloadable ready-to-use survey and a survey with the code used in the step-by-step guide (as well as some debugging code, and R code for data cleaning). 

Additional reference material for both surveys is provided through QMT Web Appendix A.

Here, we reproduce the instructions for navigating the ready-to-use survey. Figures are included in the Web Appendix, but not reproduced here. In general, we refer interested users to our web appendix, which contains full documentation.

All Functionality Contained Within two Qualtrics Questions
	The ready-to-use QMT survey contains only two Qualtrics questions: one is for mouse-tracking and the other operationalizes a custom next button (Figure W1). The question labelled “MOUSE-TRACKING” contains all mouse-tracking code, and the question labelled “CUSTOM NEXT BUTTON” overrides the Qualtrics default next button. The purpose of disabling the default Qualtrics settings is to position the next button—prior to the mouse-tracking page—in a location that does not generate unintended mouse-hovers or systematically favor certain ROIs over others. For example, if a participant advanced to the mouse-tracking screen by clicking the next button on the prior page, and if doing so positioned the participant’s cursor in the exact location of a ROI, then the researcher may be incorrect to infer dwells reflect attention (as opposed to a mechanical artifact of the design). We encourage researchers to use our custom next button, for which they can set the desired page location (as will be discussed shortly).

 In this tutorial, we differentiate between survey design and QMT customization. Survey design refers to the set of additional Qualtrics questions and non-mouse-tracking content (e.g., instructions, additional stimuli, response options, etc.), while QMT customization refers to the layout, operation, and contents of mouse-tracked questions. 
Customizing the Survey Design
	Survey design involves everything beyond the core functionality of mouse-tracking questions. Surveys can be constructed as normal, though special care must be taken to preserve the functionality of the two QMT questions. We recommend leaving the two QMT questions untouched and creating new questions on the same page (Figure W2). Advanced techniques modifying the contents of the QMT questions are discussed in the technical portion of this appendix. 

The method of adding separate questions is preferred because it preserves the core functionality of the QMT questions. Any attempt to modify these questions will likely overwrite key functionality, unless the edits are made using HTML View. We discuss editing questions in HTML View extensively in the technical portion of this appendix. For the purposes of this quick-start guide, we encourage users to avoid making any modifications to the two QMT questions. In the event one of the QMT questions is inadvertently overwritten, this modified question should be deleted and a new (original) version of the question should be imported/copied in its place.


Customizing the Mouse-Tracking
	Researchers can modify most of the mouse-tracking functionality through Qualtrics’ embedded data panel. The table below contains a list of all embedded data variables and their usage instructions (Table W1). 


 
Table W1: Embedded Data Variables.


Variable Name(in Embedded Data)             	Value	                   Usage Instructions
timeList		Do not assign a value. This variable will be updated with a list of sequential dwell times.
regionList		Do not assign a value. This variable will be updated with a list of sequential ROIs.
mainSequence		Do not assign a value. This variable will be updated with a list of sequential dwell times, indexed by ROI.
period	1	Assign a value of 1. This variable will be used to track the trial iteration, when applicable.
delayInMs	25	Recommended value of 25. This implements a slight delay (in ms) that improves the reliability of the code.

debugMode	[0, 1]	Set this variable to 1 to turn on the debugger or 0 to turn it off. 

rows	[1, k]	Set the number of rows as a positive integer value
cols	[1, k]	Set the number of columns as a positive integer value
		
titleLeft	[0, 1]	Set this variable to 1 to display titles to left of the mouse-tracked matrix; otherwise, set it to 0.
titleTop	[0, 1]	Set this variable to 1 to display tiles on the top of the mouse-tracked matrix; otherwise, set it to 0.
		
titleWidth	set as integer	Width of non-mouse-tracked title area (in pixels)
titleHeight	set as integer	Height of non-mouse-tracked title area (in pixels)
titleHorizontalSpacing	set as integer	Horizontal distance between titles and matrix border (in pixels)
titleVerticalSpacing	set as integer	Vertical distance between titles and matrix border 
(in pixels)
		
p1_titleLeft	specific formatting required	Use *** to delimit the contents of each title region. There should be (rows – 1) delimiters to separate the contents. Example usage for rows = 3 is: 
“these *** are *** titles”

p1_titleTop	specific formatting required	Use *** to delimit the contents of each title region. There should be (cols – 1) delimiters to separate the contents. Example usage for cols = 4 is: 
“these *** are *** also *** titles”

and… pt_titleLeft	specific formatting required	for t in 1:trials, create a separate variable for each t trial (e.g., “p2_titleLeft” and “p3_titleLeft” for trials = 3)
and… pt_titleTop	specific formatting required	for t in 1:trials, create a separate variable for each t trial (e.g., “p2_titleTop” and “p3_titleTop” for trials = 3)
		
boxWidth	set as integer	Width of mouse-tracked ROIs (in pixels)
boxHeight	set as integer	Height of mouse-tracked ROIs (in pixels)
horizontalSpacing	set as integer	Horizontal distance between ROIs (in pixels)
verticalSpacing	set as integer	Vertical distance between ROIs (in pixels)
		
p1_hidden	specific formatting required	Use *** to delimit the hidden contents of each ROI. There should be (rows * cols - 1) delimiters to separate the contents. 
p1_revealed	specific formatting required	Use *** to delimit the revealed (displayed by default) contents of each ROI. There should be (rows * cols - 1) delimiters to separate the contents.

and… pt_hidden	specific formatting required	for t in 1:trials, create a separate variable for each t trial (e.g., “p2_hidden” and “p3_hidden” for trials = 3)
and… pt_revealed	specific formatting required	for t in 1:trials, create a separate variable for each t trial (e.g., “p2_revealed” and “p3_revealed” for trials = 3)
		
buttonX	[5, 95]	Set the custom button location, based on the percent of the way to the left edge of the screen
buttonY	[5, 95]	Set the custom button location, based on the percent of the way to the bottom edge of the screen
		
alignHorizontal	[left, center, right]	Set the horizontal alignment (i.e., left-justified, centered, or right-justified) of your contents 
alignVertical	[top, center, bottom]	Set the vertical alignment (i.e., aligned top, centered, aligned bottom) of your contents


	The variables timeList, regionList, and mainSequence are instantiated but not assigned any value in embedded data. The purpose of these variables is to declare where the mouse-tracking data should be stored, after it is collected. Variables timeList and regionList will contain ordered lists of dwell times and ROIs visited, respectively. The variable mainSequence will contain an ordered list of time-ROI pairs. 
	Regardless of specific survey design choices, the code expects a variable called period, which should be initially set to 1. This variable tracks the number of mouse-tracking periods (trials). For designs with a single instance of mouse-tracking, this variable may not appear to serve an important function (though it is necessary for the QMT code). However, in designs featuring multiple instances of QMT—like multiple different mouse-tracked questions, blocks, or repeated Loop and Merge questions—this variable indexes the period for mouse-tracked data. For example, if a single QMT question is structured within a Loop and Merge to be presented a total of three times, the period variable is used to (i) tell the mouse-tracking question which data to present on each iteration and (ii) how to store the data so that the researcher can identify which dwells occurred in a given loop. The period variable increments after each mouse-tracking question is presented, regardless of whether there are multiple copies of the mouse-tracking question, or a single mouse-tracking question that iterates through a Loop and Merge. 
	We suggest using a slight delay (i.e., delayInMs = 25), to help with the reliability of code execution, which is further discussed in the technical guide (later in Step 4).
	To assist with debugging and visualizing real-time mouse-tracking data, there is a debugging tool that can be turned on (debugMode = 1) or off (debugMode = 0). The debugger is only for testing purposes and should always be turned off for data collection.

The layout of your QMT page begins by specifying the number of rows and columns. These variables require a non-negative integer, and the minimum possible value is 1. Therefore, the total number of ROIs will be the product of the number of rows and number of columns. By default, the program will regard the top-left region (row 1, column 1) as the first region, and then will work from left to right before proceeding to the next row. (An easy method to verify the numerical identity of a region is to hover over it with the debugging tool on, and to check how the mouse-tracking data are being stored.) While there is not technically a maximum number of rows or columns, page size constraints will be important to consider. Various page layout examples are provided in Figure W3.
	The examples in Figure W3 highlight the different options for including non-mouse-tracked titles, which are controlled by titleLeft and titleTop. When titleLeft is set to 1, each row displays a title (if provided) to the left of the mouse-tracked grid. When titleTop is set to 1, each column displays a title (if provided) above the mouse-tracked grid. (In Figure W3, Example A does not use titles, Example B uses only titleTop, and Example C uses both titleLeft and titleTop.) 
Counterbalancing using embedded data
Titles and mouse-tracked ROIs get their content directly from embedded data. Using embedded data allows researchers to easily incorporate additional Qualtrics features, such as randomization and branch logic. For example, researchers could use a randomizer in embedded data to counterbalance the order of contents (e.g., defining contents as “A, B” and also “B, A”, and randomizing which order a participant receives).
Modifying the question-specific content
	Irrespective of whether the researcher uses any form of randomization or counterbalancing, setting the content of the titles and mouse-tracked ROIs requires a precise formatting of both the variable name and variable contents. Regarding the variable naming conventions: Titles, hidden content (displayed only during a hover), and revealed content (displayed by default, without a hover) each require an embedded data variable that indexes the intended period. Each of these variables begins with pt_, where t is the time period in which the contents should be shown. For example, p1_, p2_, and p3_, would all be included in the variable names for contents to be displayed during periods 1, 2, and 3, respectively. All surveys will have at least one period by default, so p1_titleLeft and p1_titleTop are used to store title contents, and p1_hidden and p1_revealed are used to store hidden and revealed contents, respectively. There should be an additional variable created for each trial in the survey design (e.g., adding in p2_hidden, p2_revealed, p3_hidden, p3_revealed for a three-period design).
Delimiting
	To set the variable contents of each of these variables, your content must be delimited by three asterisks (***). This is how the QMT code separates distinct bits of text. For example, to set the revealed content of three regions as Region 1, Region 2, and Region 3, you would define p1_revealed as the asterisk-delimited string: Region 1***Region 2***Region 3. This approach is used for titles and ROI contents, so the code to set top titles in period 1 would look like: p1_titleTop = Option A***Option B.
Images
	As depicted in Figure W3, you can also insert images (in the form of image URLs). These can be externally hosted images (e.g., the URL of an image from a website) or internally hosted images (e.g., images you upload to your Qualtrics library).  In order to indicate that you will be using an image—as opposed to regular text—you must append the following text, without quotations, before the image’s URL: “IMAGE_URL:”. For example, you would insert title images as: p1_titleTop = IMAGE_URL:https://whatever_your_url_is*** IMAGE_URL:https://whatever_your_other_url_is.
Dimensions
	In addition to setting the contents (of both non-mouse-tracked titles and the mouse-tracked ROIs), users can also specify certain formatting aspects of the content.  The size of the non-mouse-tracked title area (if applicable) is set by titleWidth and titleTop, both of which should take a positive integer value to specify the size, in pixels. The variable titleHorizontalSpacing determines the distance between the titleLeft and the left-most edge of the mouse-tracking grid. The variable titleVerticalSpacing determines the distance between the titleTop and the top of the mouse-tracking grid. Relatedly, the size of the mouse-tracked ROIs is controlled by boxWidth and boxHeight (also in pixels). The space between rows and columns is set by verticalSpacing and horizontalSpacing, respectively. 
Alignment
	You can also set the alignment of your contents within the title areas and ROI dimensions you determine. The variable alignHorizontal allows you to specify left-, center-, or right-alignment using keywords: left, center, right. The variable alignVertical allows you to specify top-, center-, or bottom-alignment using keywords: top, center, bottom.  

Next button
	Finally, you can set the location of the custom next button through the variables buttonX and buttonY. Both variables expect a value in the range [5, 95].  For buttonX, the value corresponds to the percent of the way to the left edge of the screen (moving from right to left). For buttonY, the value corresponds to the percent of the way to the bottom of the screen (moving from top to bottom). Therefore, buttonX = 5 and buttonY = 5 corresponds to the top-right-most corner; buttonX = 50 and buttonY = 50 corresponds to the center of the page; and buttonX = 95 and buttonY = 95 corresponds to the bottom-left-most corner. As previously discussed, we suggest you place the custom next button on the page preceding the mouse-tracking (and set the location such that the default cursor location does not overlap any ROI).
	At this point, we invite readers to test the ready-to-use QMT survey and experiment with the embedded data controls. To assist in data analysis, we provide additional R code to help unpack the QMT mouse-tracking data, which is available for download through the GitHub page and also discussed later in this appendix (Step 11).

