- [How to run this project](#how-to-run)
- [Using Locally](#using-locally)
- [Using Docker](#using-docker)
- [Author](#author)

<div id='how-to-run'/>

## How to run this project

To use this project, first download it to your machine and create a <b>.env</b> file with variables according to the <b>.env.example</b> file. Once you've done that, it can be used either on a local server or with the help of Docker.

<div id='using-locally'/>

## <li> Using Locally

If you choose to use it on a local server, you will need to install the project's dependencies with the following command:

```bash
$ npm install
```

After that, the project will be ready to run using one of the following commands:

```bash
$ npm run start
```

<div id='using-docker'/>

## <li> Using Docker

To do this, first make sure you have [Docker](https://www.docker.com) properly installed on your machine. Then use the following commands in sequence:

```shell
$ docker build -t clean-architecture .

$ docker run -p <docker_port>:<env_port> --env-file .env clean-architecture
```

<div id='author'/>

## Author

- <a href="https://github.com/DouglasVolcato"> Douglas <a/>