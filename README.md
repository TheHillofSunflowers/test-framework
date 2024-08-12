# test-framework
> Playwright Web Testing Framework for YouTube


Automation testing framework created in TypeScript to practice SDET skills on an industry product.
Enhanced with Docker for containerization and GitHub Actions.
Features Unit, Integration, and E2E tests while implementing the Page Object Model.


### Tools:
TypeScript, JavaScript, Playwright, Github Actions CI/CD, Docker Containerization

To run the tests locally:

    1. Clone the repo
    2. Install node.js, and then run npm install in your terminal after moving into the root directory
    3. Run npx playwright test
    4. Optionally, you may add the --headed tag at the end of the above command to visually see the tests run, with the drawback of slower performance
    5. Optionally, you may instead run
        npx playwright test --shard=1/4
        npx playwright test --shard=2/4
        npx playwright test --shard=3/4
        npx playwright test --shard=4/4 
       as sharding will improve performance by running the tests with optimal CPU core utilization

### To do:

E2E Testing (Uploading of Videos)

Network Testing

API Testing

Refactoring in Selenium, Python, Java

Dynamic POM Implementation

Manual Test Cases

Properly Documented Requirements and Suites

Bug Reports

DevOps (Practicing with Cloud and CI/CD Pipeline)
