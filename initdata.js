async function queryArticles() {
  const url =
    'https://ielts.itongzhuo.com/business/single/stu/queryListenSingleMapList.do?sMeType3=1&stuId=812929&no_cache=1725095431650'
  try {
    const response = await fetch(url, {
      headers: getHeaders()
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.json()
    //console.log(json)
    return json.returnData.mockExamSingleListenList
  } catch (error) {
    console.error(error.message)
  }
}

async function getBindId(sid) {
  const url =
    'https://ielts.itongzhuo.com/business/listen/stu/jumpIntensiveListening.do?type=1&bindLId=0&sId=' +
    sid
  try {
    const response = await fetch(url, {
      headers: getHeaders()
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const html = await response.text()

    //<input type="hidden" name="bindLId" id="bindLId" value="3307">
    //console.log(html)
    let pattern = /.*name="bindLId" id="bindLId" value="(\d+)".*/
    let arr = pattern.exec(html)
    return arr[1]
  } catch (error) {
    console.error(error.message)
  }
}

async function queryArticleData(bId) {
  const url =
    'https://ielts.itongzhuo.com/business/listen/stu/queryMockListenList.do?type=1&lId=' + bId
  try {
    const response = await fetch(url, {
      headers: getHeaders()
    })
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

async function saveArticle(bookId, testId, partId, body) {
  const url =
    'http://127.0.0.1:8080/cambridge-listening/player/save-article?' +
    new URLSearchParams({ bookId, testId, partId }).toString()
  console.log(url)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const json = await response.text()
    console.log('----save----' + json)
    return json
  } catch (error) {
    console.error(error.message)
  }
}

async function main() {
  const articles = await queryArticles()
  let queryNum = articles.length
  let bookId, testId, partId, sId
  for (let i = 0; i < queryNum; i++) {
    bookId = articles[i].s_me_type2
    testId = articles[i].s_test.trim()
    partId = articles[i].s_part
    sId = articles[i].s_id
    console.log('bookId: ' + bookId + ', testId:' + testId, +', partId:' + partId + ', sId:' + sId)

    let bid = await getBindId(sId)
    console.log('bid:' + bid)

    let articleData = await queryArticleData(bid)
    //console.log('articleData:' + articleData)

    await saveArticle(bookId, testId, partId, articleData)
  }
}

function getHeaders() {
  return {
    Cookie:
      'Cookie: _uab_collina=172041715820827322753993; HMACCOUNT=F34276D56412018A; _ga=GA1.1.999978627.1720417158; href=https%3A%2F%2Fielts.itongzhuo.com%2Fbusiness%2Fielts%2Fstudent%2FjumpIeltsQuestionList.do%3FsSubjects%3D0%26type%3D1%26chatGptType%3D0; autoLogin=1; NameP1=18918413198; PhoneP=f624db29faa887530773ca8982c4800e; Mark=pcPhone; tfstk=fwVqDlw2ifqSJc2i40GZYD-8lZcx_XICj5isSP4ilmm0hZQZSPm7lCGb5hWgDyojIihb_urbYfOscs3M_P4nmIislVRa4ymmhjs9_NouqmZbhPN8bkEE1VVaWCugSlQxfZB7krhtsMsQ_6aYkrt73-PqI30uyVLmSFzhQTctsMs7PWVsGfEIasMRQzbr5VpMslDmr4m-RccimAxkE2mojfcgj4Do82xmom00rYY-3WV94VMc-nYC4J68Nxo3rTdetBuDADUm4Cfs0qkq8rmysCVzeOwRlD5yq0agJRDz_sdj6zwUbRqlSCmaE2rERo1kgf2u4Wk3yMRx08qY_jMd_FuzLzq4gfWek4N4rWHaMiRo0uUudjFh2Cr3PyNxe5SeqcejJb04UNvomAjzYh3u_gPT3hvZn43rAa7uZQaOJd5yMKp9BxQxzD_mndptnDgrAaYkBdHf04oCPT1..; useNameEP=18918413198; pwdEP=f624db29faa887530773ca8982c4800e; useNameIelts=; pwdEPIelts=; parent_qimo_sid_3fa45e10-09c4-11ed-811e-0d8d99cb03e8=80471a43-275d-431e-bc6b-e776a545336f; dropGuide=1; _ga_FDS6ZF9F0R=deleted; Hm_lvt_776b9ce1516f3f52c5665c77cb6d045d=1723014906; accessId=3fa45e10-09c4-11ed-811e-0d8d99cb03e8; JSESSIONID=E5790DA76167BD03F22F8FD068378704; qimo_seosource_0=%E7%AB%99%E5%86%85; qimo_seokeywords_0=; ielts_sessionId=E5790DA76167BD03F22F8FD068378704; qimo_seosource_3fa45e10-09c4-11ed-811e-0d8d99cb03e8=%E7%AB%99%E5%86%85; qimo_seokeywords_3fa45e10-09c4-11ed-811e-0d8d99cb03e8=; qimo_xstKeywords_3fa45e10-09c4-11ed-811e-0d8d99cb03e8=; sessionoverdue=1; pageViewNum=24; _ga_FDS6ZF9F0R=GS1.1.1725170091.77.1.1725170094.57.1.1447808900; PhonePIelts=; NameP1Ielts=; zg_did=%7B%22did%22%3A%20%2219090da8497581-0aef9d963f0456-19525637-13c680-19090da849822cb%22%7D; zg_7e48354fff3344379f549afcba95f8b8=%7B%22sid%22%3A%201725170092196%2C%22updated%22%3A%201725170095487%2C%22info%22%3A%201724649679124%2C%22superProperty%22%3A%20%22%7B%5C%22%E5%BA%94%E7%94%A8%E5%90%8D%E7%A7%B0%5C%22%3A%20%5C%22%E9%9B%85%E6%80%9DAI%5C%22%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22ielts.itongzhuo.com%22%2C%22landHref%22%3A%20%22https%3A%2F%2Fielts.itongzhuo.com%2Fbusiness%2Fielts%2Fstudent%2FjumpIeltsQuestionList.do%3FsSubjects%3D1%26type%3D4%22%2C%22cuid%22%3A%20%22796563%22%2C%22zs%22%3A%200%2C%22sc%22%3A%200%2C%22firstScreen%22%3A%201725170092196%7D; Hm_lpvt_776b9ce1516f3f52c5665c77cb6d045d=1725170096'
  }
}

await main()
