# Commerce Extensibility Starter Kit

Welcome to Adobe Commerce Extensibility Starter Kit 

![Alt text](architecture.png "Title")

## Pre requisites
Go to developer portal
- Create a new project from template
- Add the following API services
  - Adobe I/0 events
  - Adobe I/O management

- Git clone the project from the following repo https://git.corp.adobe.com/enterprise-integration/starter-kit
- Configure the env file `cp env.dist .env`

## Setup

Ensure to select the proper Organization > Project > Workspace with the following commands:
`aio console org select`
`aio console project select`
`aio console workspace select`

After that initiate the Application with the following command `aio app use`
Install dependencies using the command `npm install`

Define all the required parameters inside your `.env` file, in the `.env` file is auto explained from where to retrieve that information.

