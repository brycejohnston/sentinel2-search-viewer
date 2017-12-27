const BaseUrl = "https://sentinel2.satgateway.com/api/v1/tiles.json";

function buildUrl (mgrs, start_date, end_date) {
  url = BaseUrl;
  if (mgrs !== undefined) {
    url = url + "?mgrs=" + mgrs;
    if (start_date !== undefined) {
      url = url + "&start_date=" + start_date;
    }
    if (end_date !== undefined) {
      url = url + "&end_date=" + end_date;
    }
  }
  return url;
}

Vue.component('tiles-list', {
  props: ['results'],
  template: `
    <section>
      <div class="row" v-for="tiles in processedTiles">
        <div class="columns medium-3" v-for="tile in tiles">
          <div class="card">
            <div class="card-divider">
              Date: <a v-bind:href="'http://sentinel-s2-l1c.s3-website.eu-central-1.amazonaws.com/#' + tile.path + '/'" target="_blank">{{ tile.date }}</a>
            </div>
            <div class="card-section">
              <p>
                <img :src="tile.thumbnail" class="thumbnail">
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  computed: {
    processedTiles() {
      let tiles = this.results;

      // Put Array into Chunks
      let i, j, chunkedArray = [], chunk = 4;
      for (i=0, j=0; i < tiles.length; i += chunk, j++) {
        chunkedArray[j] = tiles.slice(i,i+chunk);
      }
      return chunkedArray;
    }
  }
});

const vm = new Vue({
  el: '#app',
  data: {
    results: []
  },
  props: ['mgrs', 'start_date', 'end_date'],
  methods: {
    getTiles(mgrs, start_date, end_date) {
      let url = buildUrl(mgrs, start_date, end_date);
      axios.get(url).then((response) => {
        this.results = response.data;
      }).catch( error => { console.log(error); });
    }
  }
});
