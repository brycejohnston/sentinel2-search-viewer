const BaseUrl = "https://sentinel2.cropquest.net/api/v1/tiles.json";

function buildUrl (mgrs) {
  return BaseUrl + "?mgrs=" + mgrs
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
                <img :src="tile.thumbnail">
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
  methods: {
    getTiles(section) {
      let url = buildUrl(section);
      axios.get(url).then((response) => {
        this.results = response.data;
      }).catch( error => { console.log(error); });
    }
  }
});
