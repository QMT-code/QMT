# QMT
Qualtrics Mouse-Tracking

In this respository, we currently provide a downloadable ready-to-use survey and a survey with the code used in the step-by-step guide (as well as some debugging code, and R code for data cleaning). 

We recommend users begin with the downloadable ready-to-use .qsf ("QMT_Ready-to-Use"). A full guide to this ready-to-use survey is included in the first half of the included appendix. 

This appendix also includes the code that is constructed in the step-by-step guide (also referenced in the appendix). 

Downloadable R code cleans the Qualtrics output data (specifically, converts the contents of the mainSequence variable into a long data frame).

Users do not need to download the debugging.js file; it is automatically read in when debugMode = 1 (in a survey's embedded data).
