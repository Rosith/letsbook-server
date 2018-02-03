[![CircleCI](https://circleci.com/gh/CognizantStudio/lp02-team-5-mock-server.svg?style=shield&circle-token=74cfcb75f5c33e9227e398f6b7171e62414aa015)](https://circleci.com/gh/CognizantStudio/lp02-team-5-mock-server)
[![Maintainability](https://api.codeclimate.com/v1/badges/c32883e00a5c2206eca1/maintainability)](https://codeclimate.com/repos/5a022b44478e79028a0003fc/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c32883e00a5c2206eca1/test_coverage)](https://codeclimate.com/repos/5a022b44478e79028a0003fc/test_coverage)


# README

### related urls
[Mock client repository](https://github.com/CognizantStudio/lp02-team-5-mock-client)
[Mock client prod app](https://lp02-team-5-mock-client.herokuapp.com/)
[Mock server prod app](https://lp02-team-5-mock-server.herokuapp.com/)

### set it up

1. `$ yarn install`
1. `$ cp .env.example .env`
1. `$ createdb lp02_team_5_mock_development`
1. `$ createdb lp02_team_5_mock_test`
1. `$ yarn db:migrate`
1. `$ yarn db:migrate:test`
1. rollback to a specific version:
    * `$ MIGRATE_TO=<TIMESTAMP OF MIGRATION> yarn db:migrate`
1. `$ nodemon start`
    * `$ yarn global add nodemon` if you don't have it... this will restart your server on *most* changes

### deploy to heroku:
1. create app on heroku
1. add Heroku Postgres add-on
1. add needed envs (no need to add test database url or database url, database url should already be created)
1. `$ heroku run yarn db:migrate`
1. `$ heroku logs --tail` if you need to see logs

### Tests, test coverage & reports, and linter
Tests (also runs linter on success)
* `$ yarn test`

Test coverage and reports
* `$ yarn coverage` - runs tests and reports coverage
* `$ yarn reports` - generates coverage artifacts

Linter alone
1. `$ yarn lint`

### [curl docs](./curl.md)

### contribute to it
* clone, setup locally following the 'set it up' instructions
* checkout a branch and commit your work
* push branch
* submit PR
* periodically pull upstream master into master, and rebase the branch on top, force pushing the rebased branch when necessary
* SQUASH AND MERGE the PR when it is approved
