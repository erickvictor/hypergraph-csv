# Working with Export CSV in Hygraph

This example demonstrates how to mutate Hygraph data with node.

## How to Use

### Download Manually

```bash
git clone https://github.com/erickvictor/hypergraph-csv.git
```

Install & Run:

```bash
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
cd hypergraph-csv
npm install
npm run start
# or
cd hypergraph-csv
yarn
yarn start
```