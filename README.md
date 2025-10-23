# VAL

Secure asset register (Vault Asset Log)

# Production Installs

## Install dependencies

- Ensure build machine has Node v18.x and yarn v1.22.x installed
- Download a zip snapshot from GitHub (probably from the newest Release)
- run `yarn` command in root project folder to install/update dependencies

## Build production application

- run `yarn build:prod` to create production instance
- zip up whole folder and transfer to host device
- run `yarn serve` on host device

## Build test application

It is possible to produce a build of VAL that cosmetically changes the color scheme and application title to make it clear that this is a test instance, not a production instance.

- run `yarn build:test` to create test instance
- zip up whole folder and transfer to host device
- run `yarn serve` on host device

# New developers

## Setup project on local

- Clone the project form github
- run `yarn` command in root project folder

### Setup husky to install git hooks

- Run command `yarn prepare` in root project folder

### Build the application

- Run command `yarn build` in root project folder, this will create a deployment in the `dist` sub-folder

### Run the application (development)

- Run command `yarn dev` in root project folder

### Run the application (production)

- Run command `yarn serve:soul` in root project folder

## Note

When running the `serve` or `serve:dev` commands, `soul-cli` executes and passes
most of the keys to the `soul` commands,
such as `PORT`, `DB`, `TOKEN_EXPIRATION_TIME`, and others.
However, please note that, for security reasons, the `TOKEN_SECRET` key is extracted
from the environment variables, or the `.env` file in the VAL installation folder. An example of the `.env` file is provided [here](https://github.com/DeepBlueCLtd/RCO/blob/main/.env).
