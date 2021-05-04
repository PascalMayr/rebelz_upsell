const axios = require('axios');
const fsPromises = require('fs').promises;

const start = async () => {
  console.log('Startup to GitHub started');

  const github = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 20000,
    headers: {
      Authorization: `token ${process.env.GITHUB_PAT}`
    }
  })

  console.log('Getting the current file SHA');
  let startup_file = await github.get('/repos/mayrsascha/rebelz_startup/contents/startup.js');
  console.log('Got the current file SHA response');

  const file_sha = startup_file.data.sha;
  console.log('Got the current file SHA', file_sha);

  console.log('Reading startup dist file contents');
  const startup_file_content = await fsPromises.readFile('dist/startup.js');

  console.log('Uploading startup to GitHub');
  console.log(    {
    message: 'Deploy from startup to GitHub script',
    sha: file_sha,
    content: startup_file_content.toString('base64')
  });
  await github.put('/repos/mayrsascha/rebelz_startup/contents/startup.js',
    {
      message: 'Deploy from startup to GitHub script',
      sha: file_sha,
      content: startup_file_content.toString('base64')
    }
  );
  console.log('Finished successfully');
}

start();

