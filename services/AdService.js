import axios from 'axios'

const apiClient = axios.create({
  // baseURL: `http://10.82.14.183:9001/api/scread`,
  baseURL: `http://127.0.0.1:8889/api/scread`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

async function sendToEnrichr(genes) {
  const geneSetLibrary = 'KEGG_2019_Human'
  const formData = new FormData()
  formData.append('method', 'post')
  formData.append('name', 'list')
  formData.append('enctype', 'multipart/form-data')
  formData.append('list', genes.join('\n'))
  formData.append('description', 'test test')
  const geneListEnrichrId = await axios
    .post('https://amp.pharm.mssm.edu/Enrichr/addList', formData)
    .then(function(response) {
      return response.data.userListId
    })
  const enrichrResult = await axios
    .get(
      'https://amp.pharm.mssm.edu/Enrichr/enrich?userListId=' +
        geneListEnrichrId +
        '&backgroundType=' +
        geneSetLibrary
    )
    .then(function(response) {
      return response.data
    })
  return enrichrResult
}

export default {
  sendToEnrichr,
  getDatasets() {
    return apiClient.get('/dataset')
  },
  getDataset(id) {
    return apiClient.get('/dataset/' + id)
  },
  getDeMeta(id) {
    return apiClient.get('/de/' + id + '/meta')
  },
  getDe(params) {
    return apiClient.get(
      '/de/' +
        params.aDataId +
        '?second_id=' +
        params.bDataId +
        '&ct=' +
        params.ct +
        '&type=' +
        params.type
    )
  },
  getRegulon(id) {
    console.log(id)
    return apiClient.get('/regulon/AD00102')
  },
  getDimension(id) {
    return apiClient.get('/dimension/' + id)
  },
  getExpression(gene) {
    return apiClient.get('/expression/' + gene)
  }
}