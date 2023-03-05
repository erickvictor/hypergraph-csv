require('dotenv').config();
const csvToJson = require('convert-csv-to-json');
const Queue = require('bee-queue');
const { GraphQLClient, gql } = require('graphql-request')

const createContentEntry = async (variables) => {
  const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
    },
  });

  const query = gql`
    mutation createAuthor($firstName: String, $lastName: String) {
      createAuthor(data: { firstName: $firstName, lastName: $lastName }) {
        id
      }
    }
  `;

  return client.request(query, variables);
};

const run = async () => {
  const data = csvToJson.getJsonFromCsv('./data.csv');

  const queue = new Queue('Hygraph Import');

  await Promise.all(
    data.map(async (row) => {
      const job = await queue.createJob(row).backoff('fixed', 5000).save();

      return job;
    }),
  );

  queue.on('job succeeded', (jobId) => console.log(`[SUCCESS]: ${jobId}`));
  queue.on('job failed', (jobId, err) =>
    console.log(`[FAILED]: ${jobId} (${err})`),
  );

  await queue.process(async (job) => await createContentEntry(job.data));
};

run();