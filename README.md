# Pharo Indexer

## Installation

## Configuration

## Usage

## Development

## Production

## Postgraphile

>If you don't have postgraphile installed, you can install it globally with npm:
```sh
npm install -g postgraphile
```

### To run postgraphile, you can use the following command(s).
Development:
```sh
postgraphile \
  --subscriptions \
  --watch \
  --dynamic-json \
  --no-setof-functions-contain-nulls \
  --no-ignore-rbac \
  --show-error-stack=json \
  --extended-errors hint,detail,errcode \
  --append-plugins @graphile-contrib/pg-simplify-inflector \
  --export-schema-graphql schema.graphql \
  --graphiql "/" \
  --enhance-graphiql \
  --allow-explain \
  --enable-query-batching \
  --legacy-relations omit \
  --connection $DATABASE_URL \
  --schema app_public
```