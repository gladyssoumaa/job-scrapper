# JOB SCRAPPER

A project that collects public remote job postings from Remote OK, cleans and structures the data, and uses an AI/NLP step to extract technical skills requested in job descriptions.

The project also evaluates the AI extraction step by manually checking 30 job postings and calculating its accuracy.


## 1. Objectives

The objectives of this project are to:

* Collect at least 200 public job postings.
* Build the scraper using TypeScript.
* Respect the source website's `robots.txt` rules.
* Add delays between requests to avoid sending requests too quickly.
* Store job postings using consistent fields.
* Use an AI/NLP step to extract useful information from job descriptions.
* Extract the skills requested by each job posting.
* Manually evaluate at least 30 postings.


## 2. Data Source

### We Work Remotely

The project uses [We Work Remotely](https://weworkremotely.com/) as its job-posting source.

### Responsible Scraping

The project follows several responsible scraping practices when collecting job listings.

#### Robots.txt

Before requesting each target page, the scraper checks the website's `robots.txt` rules to determine whether the page can be accessed by the scraper.

#### Request Delay

A delay is added between requests to avoid sending requests continuously and to reduce unnecessary load on the website.

The current delay is 1 second


## 5. Technologies Used

* TypeScript - main programming language
* Node.js - runtime environment
* Axios - http requests
* Cheerio - parsing html
* robots-parser - robots.txt checking
* Groq SDK - communication with the AI model
* JSON - storing collected and classified job data
* CSV Parse - reading the manual validation CSV


## 6. Project Structure

```
job-scraper/
│
├── data/
│   ├── jobs.json
│   └── jobs_with_seniority.json
│
├── src/
│   ├── ai.ts
│   ├── classify.ts
│   ├── create-validation.ts
│   ├── evaluate.ts
│   ├── index.ts
│   ├── robots.ts
│   ├── scrapper.ts
│   ├── storage.ts
│   ├── test-ai.ts
│   ├── types.ts
│   └── utils.ts
│
├── validation/
│   └── manual_validation.csv
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```



## 7. Data Fields

Each job posting is stored using consistent fields.

| Field         | Description                      |
| ------------- | -------------------------------- |
| `id`          | Unique identifier for the job    |
| `title`       | Job title                        |
| `company`     | Company offering the job         |
| `location`    | Job location                     |
| `date`        | Date associated with the posting |
| `description` | Job description                  |
| `url`         | Original job posting URL         |
| `tags`        | Tags associated with the job     |
| `skills`      | Skills extracted by the AI step  |

Example:

```json
{
    "id": "https://weworkremotely.com/remote-jobs/passive-income-dentist-director-of-operations-full-time-remote-north-america",
    "title": "Director of Operations — Full-Time | Remote (North America)",
    "company": "Passive Income Dentist",
    "location": "Tennesse",
    "date": "14d",
    "description": "Director of Operations — Full-Time | Remote (North America) at Passive Income Dentist. Location: Tennesse.",
    "url": "https://weworkremotely.com/remote-jobs/passive-income-dentist-director-of-operations-full-time-remote-north-america",
    "tags": [
      "Full-Time",
      "$100,000 or more USD",
      "Anywhere in the World"
    ]
  }
```


## 8. Installation

Clone the repository:

```bash
git clone <repository-url>
cd job-scraper
```

Install the dependencies:

```bash
npm install
```

Create an environment file and update the environment variables where required.



## 9. Running the Project

Run the scraper using:

```bash
npm start
```

During development, the project can be run using:

```bash
npm run dev
```

To compile the TypeScript code:

```bash
npm run build
```


## 10. Scraping Process

The scraper follows these steps:

1. Request the we work remotely  `robots.txt` file.
2. Check the relevant crawling rules.
3. Identify publicly accessible job pages.
4. Request job pages one at a time.
5. Wait between requests.
6. Extract the required fields.
7. Clean the extracted text.
8. Continue until at least 200 job postings have been collected.
9. Save the collected data as JSON.



## 11. Skill Extraction

After collecting and cleaning the job postings, an AI/NLP step processes each job description.
The purpose of this step is to identify technical and professional skills requested by employers.
The extracted skills are added to the corresponding job record.

## AI Model
The project uses `openai/gpt-oss-20b` from Groq SDK. The classification prompt uses a low temperature of 0.2


## 12. Accuracy Evaluation

The skill extraction is evaluated using a manually checked sample of at least 30 job postings.

For each selected posting:

1. The job description will be read manually.
2. The skills present in the description will be recorded.
3. The extracted skills will be compared with the manually identified skills.
4. The result will be recorded in `validation/manual-validation.csv`.


### Manual Validation
To evaluate the AI classification, 30 job postings were manually reviewed. The validation dataset is stored in `validation/manual_validation.csv`

The CSV contains:
* Title
* Prediction
* Human_label
* Correct/Incorrect

The Human_label column contains the independently determined human classification.


## Human Classification Rules

Human validation uses predefined rules to make the evaluation consistent.

| Title indicator | Classification |
|---|---|
| Intern, Internship, Trainee, Graduate | Entry-Level |
| Junior, Jr., Associate | Junior |
| Senior, Sr., Staff, Principal, Lead | Senior |
| Manager | Manager |
| Head, Director, VP, Vice President, Chief, chair | Executive |
| No clear seniority indicator | Unknown |

### Classification Precedence

When multiple seniority indicators appear in a title, the higher-level role takes precedence.

For example:

Senior Manager → Manager



### Validation Results
The classification was evaluated against the manually labeled sample of 31 job postings.

Run the evaluation using:

`npx tsx src/evaluate.ts`

The evaluation calculates:
* Total postings evaluated
* Correct predictions
* Incorrect predictions
* Overall accuracy

**Results**
Total evaluated: 31
Correct predictions: 16
Incorrect predictions: 15
Accuracy: 51.61%












