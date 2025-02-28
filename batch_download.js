import { Downloader } from 'nodejs-file-downloader'

const DOWNLOAD_URL_PREFIX = 'https://ai-oss3.oss-cn-shenzhen.aliyuncs.com/exam'

const DEST_DIR_PATH_PREFIX = '/Users/ztf/Project/ielts-practice-node/public/audio/ielts'

async function downloadFile(destDir, url) {
  //Wrapping the code with an async function, just for the sake of example.

  const downloader = new Downloader({
    url: url, //If the file name already exists, a new file with the name 200MB1.zip is created.
    directory: destDir //This folder will be created, if it doesn't exist.
  })
  try {
    const { filePath, downloadStatus } = await downloader.download() //Downloader.download() resolves with some useful properties.

    console.log('All done')
  } catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log('Download failed', error)
  }
}

async function fetchFileObjs() {
  const url = 'http://127.0.0.1/cambridge-listening/player/articles'
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    //console.log(json)
    return json
  } catch (error) {
    console.error(error.message)
  }
}
async function batch_download(fileObjs) {
  for (let i = 0; i < fileObjs.length; i++) {
    let fileObj = fileObjs[i]
    if (fileObj.bookNum < 0) {
      continue
    }
    let destDir =
      DEST_DIR_PATH_PREFIX + '/book-' + fileObj.bookNum + '/test-' + fileObj.testNum + '/'
    await downloadFile(destDir, DOWNLOAD_URL_PREFIX + '/' + fileObj.videoPath)
  }
}

const fileObjs = await fetchFileObjs()

await batch_download(fileObjs)
