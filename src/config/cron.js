import { CronJob } from 'cron';
import https from 'https';

const job = new CronJob(
  '*/14 * * * *', // cronTime
  function () {
    https
      .get(process.ENV.API_URL, (res) => {
        if (res.statusCode === 200)
          console.log('GET request sent successfully');
        else console.error(`Request failed. Status code: ${res.statusCode}`);
      })
      .on('error', (e) => {
        console.error(`Got error while sending request: ${e.message}`);
      });
  }
);

export default job;
