library(tidyverse)

## We refer to the wide (raw) data as df
df <- read.csv("qmt_data.csv")

## This could also be set to a lab ID, workerId, PROLIFIC_PID, etc. 
df$subject_id <- c(rep(1:nrow(df)))

## Unravel the char string into a long data format
df_long <- df %>%
  ## Separate the delimited (based on '***') observations into individual rows
  separate_rows(mainSequence, sep = "***") %>%
  ## Trim whitespace
  mutate(mainSequence = trimws(mainSequence)) %>%
  ## Extract period, region, and time data
  extract(mainSequence, 
          into = c("period", "region", "time"),
          regex = "(P\\d+)_(\\w+):(\\d+)") %>%
  ## Just making sure this is numeric (and not character)
  mutate(time = as.numeric(time)) %>%
  ## Select final columns
  select(subject_id, period, region, time)

## View the result
head(df_long, 20)
