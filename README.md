This application has been initiated by this command `npx degit solidjs/templates/ts front`.

## Dependencies

```sh
npm i -f
```

## Launch hot reload server

```sh
./start
```

## Deployement

```sh
./deploy
```

## Cypress

### Launch console test in watch mode

    ./start-cypress
    ./start-cypress -f (to force build)

### Launch interactive test: webserver

    docker build -t webserver:latest -f DockerfileWeb .
    docker run -p 80:8043 webserver:latest
