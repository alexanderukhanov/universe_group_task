## Descirption
Two microservices which interact via SQS

## Project setup

run docker compose yaml file from "universe-test-services-main" folder:
```bash
$ docker-compose up
```


create and populate two .env files according to .env.example in notifications and products folders

run install modules, run migration and start server from products folder:
```bash
$ npm install
$ npm run migration:run
$ npm run start
```

run install modules and start server from notifications folder:
```bash
$ npm install
$ npm run start
```

## Run tests
```bash
# unit tests
$ npm run test
```

## Check functionality of the project
go to http://localhost:3000/api and make requests to check functionality

go to http://localhost:9090/query?g0.expr=deleted_products&g0.show_tree=0&g0.tab=table&g0.range_input=8m20s209ms&g0.res_type=auto&g0.res_density=medium&g0.display_mode=lines&g0.show_exemplars=0&g1.expr=created_products&g1.show_tree=0&g1.tab=table&g1.range_input=1h&g1.res_type=auto&g1.res_density=medium&g1.display_mode=lines&g1.show_exemplars=0 and check created_products and deleted_products counters
