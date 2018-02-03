# README

### related urls
* [Client repository](https://github.com/Rosith/letsbook-client)
* [Client prod app](https://letsbook-client.herokuapp.com/)
* [Server prod app](https://letsbook-server.herokuapp.com/)

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
