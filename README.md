# test-framework
> Playwright Web Testing Framework for YouTube


Automation testing framework created in TypeScript to practice SDET/QA skills on an industry product. Utilized DevOps skills such as Docker for containerization and GitHub Actions. Features Unit, Integration, and E2E tests while implementing the Page Object Model.


### Tools:
TypeScript, JavaScript, Playwright, Github Actions CI/CD, Docker Containerization

To run the tests locally:

    1. Clone the repo
    2. Install node.js, and then after moving into the root directory, run the terminal command: npm install
    3. Run the following command: npx playwright test
    4. Optionally, you may add the --headed tag at the end of the above command to visually see the tests run, with the drawback of slower performance and less stabilization
    5. Optionally, you may instead run:
        npx playwright test --shard=1/4
        npx playwright test --shard=2/4
        npx playwright test --shard=3/4
        npx playwright test --shard=4/4 
       as sharding will improve performance by running the tests with optimal CPU core utilization

    Alternatively, you may run the tests using the Docker image by running the following command in the root directory after cloning the repo:

        docker build -t playwright-docker .

    And then running the docker container with:

        docker run -it --rm --ipc=host mcr.microsoft.com/playwright:v1.46.1-jammy /bin/bash

### To do:

API Testing

Manual Test Cases

Bug Reports